import { createClient } from '@supabase/supabase-js'
import type { Session, User, AuthError, AuthTokenResponsePassword } from '@supabase/supabase-js'

// Безопасное получение переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Проверка в development режиме
if (process.env.NODE_ENV === 'development') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log(`
      🎭 OnkoAI Demo Mode Active
      ===========================
      Running with demonstration data.
      
      To connect to real Supabase:
      1. Update .env.local with your credentials
      2. Restart the development server
      ===========================
    `)
  }
}

// Демо-данные для работы без реального Supabase
const DEMO_DATA = {
  patients: [
    {
      id: '1',
      name: 'Иванов Иван Петрович',
      age: 45,
      diagnosis: 'Немелкоклеточный рак легкого',
      status: 'active',
      last_visit: '2024-01-15',
      created_at: '2023-12-01T10:00:00Z',
    },
    {
      id: '2', 
      name: 'Петрова Анна Сергеевна',
      age: 52,
      diagnosis: 'Рак молочной железы',
      status: 'recovering', 
      last_visit: '2024-01-10',
      created_at: '2023-11-20T14:30:00Z',
    },
  ],
  user: {
    id: 'demo-user-123',
    email: 'doctor@onkoai.demo',
    user_metadata: { name: 'Доктор Иванов' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User,
  session: {
    access_token: 'demo-token',
    refresh_token: 'demo-refresh-token',
    expires_at: Date.now() + 3600 * 1000,
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'demo-user-123',
      email: 'doctor@onkoai.demo',
      user_metadata: { name: 'Доктор Иванов' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User,
  } as Session
}

// Создаем клиент Supabase
export const supabase = createClient(
  supabaseUrl || 'https://demo-supabase.co',
  supabaseAnonKey || 'demo-key-only-for-development',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  }
)

// Для демо-режима создаем отдельный клиент с переопределенными методами
let demoMode = false

if (!supabaseUrl || supabaseUrl.includes('demo')) {
  demoMode = true
  
  // Сохраняем оригинальные методы
  const originalAuth = supabase.auth
  
  // Переопределяем методы с правильными типами
  supabase.auth.getSession = async () => {
    return {
      data: { session: DEMO_DATA.session },
      error: null,
    }
  }
  
  supabase.auth.getUser = async () => {
    return {
      data: { user: DEMO_DATA.user },
      error: null,
    }
  }
  
  supabase.auth.signInWithPassword = async ({ email, password }: any) => {
    console.log(`Demo login attempt: ${email}`)
    return {
      data: { 
        user: DEMO_DATA.user, 
        session: DEMO_DATA.session,
      },
      error: null,
    } as AuthTokenResponsePassword
  }
  
  supabase.auth.signOut = async () => {
    return { error: null }
  }
  
  // Сохраняем оригинальный from метод
  const originalFrom = supabase.from.bind(supabase)
  
  // Переопределяем from для таблицы patients
  supabase.from = (table: string) => {
    if (table === 'patients' && demoMode) {
      return {
        select: (columns?: string) => ({
          order: (column: string, options?: { ascending: boolean }) => ({
            limit: async (count: number) => {
              return {
                data: DEMO_DATA.patients.slice(0, count),
                error: null,
              }
            },
          }),
          eq: (column: string, value: any) => ({
            single: async () => {
              const patient = DEMO_DATA.patients.find(p => (p as any)[column] === value)
              return {
                data: patient || null,
                error: patient ? null : new Error('Patient not found'),
              }
            },
          }),
        }),
        insert: async (data: any, options?: any) => {
          console.log('Demo: Insert patient', data)
          return { data: null, error: null }
        },
        update: async (values: any, options?: any) => {
          console.log('Demo: Update patient', values)
          return { data: null, error: null }
        },
        delete: async (options?: any) => {
          console.log('Demo: Delete patient')
          return { data: null, error: null }
        },
      } as any
    }
    
    // Для других таблиц используем оригинальный метод
    return originalFrom(table)
  }
}

// Вспомогательные функции
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

// Функция для получения пациентов (работает в любом режиме)
export const getPatients = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      if (demoMode) {
        // В демо-режиме возвращаем демо-данные
        return DEMO_DATA.patients.slice(0, limit)
      }
      throw error
    }
    
    return data || []
  } catch (error) {
    console.warn('Error fetching patients, using demo data:', error)
    return DEMO_DATA.patients.slice(0, limit)
  }
}

// Проверка режима работы
export const isDemoMode = () => demoMode

// Получение информации о подключении
export const getConnectionInfo = () => {
  return {
    isDemoMode: demoMode,
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Not configured',
    hasCredentials: !!(supabaseUrl && supabaseAnonKey),
  }
}
