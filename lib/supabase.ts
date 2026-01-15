import { createClient } from '@supabase/supabase-js'
import type { Session, User } from '@supabase/supabase-js'

// Безопасное получение переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Проверяем режим - если URL содержит demo или ключи не настроены, используем демо-режим
const DEMO_MODE = !supabaseUrl || supabaseUrl.includes('demo') || !supabaseAnonKey

// Логирование режима
if (typeof window !== 'undefined' && DEMO_MODE) {
  console.log('🔧 OnkoAI Demo Mode: Using mock authentication and data')
}

// Демо-данные
const DEMO_DATA = {
  user: {
    id: 'demo-user-123',
    email: 'doctor@onkoai.demo',
    user_metadata: { 
      name: 'Доктор Иванов',
      role: 'doctor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor'
    },
    app_metadata: { provider: 'demo' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User,
  session: {
    access_token: 'demo-access-token-123',
    refresh_token: 'demo-refresh-token-456',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'demo-user-123',
      email: 'doctor@onkoai.demo',
      user_metadata: { 
        name: 'Доктор Иванов',
        role: 'doctor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor'
      },
      app_metadata: { provider: 'demo' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User,
  } as Session,
  patients: [
    {
      id: '1',
      name: 'Иванов Иван Петрович',
      age: 45,
      diagnosis: 'Немелкоклеточный рак легкого (стадия II)',
      status: 'active',
      last_visit: '2024-01-15',
      created_at: '2023-12-01T10:00:00Z',
      treatment: 'Химиотерапия + иммунотерапия',
    },
    {
      id: '2', 
      name: 'Петрова Анна Сергеевна',
      age: 52,
      diagnosis: 'Инвазивная карцинома молочной железы',
      status: 'recovering', 
      last_visit: '2024-01-10',
      created_at: '2023-11-20T14:30:00Z',
      treatment: 'Хирургия + гормонотерапия',
    },
    {
      id: '3', 
      name: 'Сидоров Петр Дмитриевич',
      age: 38,
      diagnosis: 'Злокачественная меланома кожи',
      status: 'critical', 
      last_visit: '2024-01-05',
      created_at: '2023-12-15T09:15:00Z',
      treatment: 'Иммунотерапия + таргетная терапия',
    },
    {
      id: '4', 
      name: 'Кузнецова Мария Владимировна',
      age: 61,
      diagnosis: 'Колоректальный рак',
      status: 'active', 
      last_visit: '2024-01-12',
      created_at: '2023-11-10T11:20:00Z',
      treatment: 'Химиотерапия + хирургия',
    },
  ]
}

// Создаем клиент Supabase
const supabaseClient = createClient(
  supabaseUrl || 'https://demo-supabase.co',
  supabaseAnonKey || 'demo-key-only-for-development',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'x-application-name': 'onkoai-demo',
        'x-app-version': '1.0.0',
      },
    },
  }
)

// Переопределяем методы Supabase в демо-режиме
if (DEMO_MODE) {
  // Сохраняем оригинальные методы
  const originalAuth = { ...supabaseClient.auth }
  
  // Переопределяем signInWithPassword для демо-режима
  supabaseClient.auth.signInWithPassword = async ({ email, password }: any) => {
    console.log(`🎭 Demo login attempt: ${email}`)
    
    // В демо-режиме ВСЕГДА успешный вход
    return {
      data: {
        user: {
          ...DEMO_DATA.user,
          email: email || DEMO_DATA.user.email,
          user_metadata: {
            ...DEMO_DATA.user.user_metadata,
            name: email.includes('admin') ? 'Администратор' : 'Доктор Иванов',
            role: email.includes('admin') ? 'admin' : 'doctor'
          }
        },
        session: DEMO_DATA.session,
      },
      error: null,
    }
  }
  
  // Переопределяем getSession
  supabaseClient.auth.getSession = async () => {
    return {
      data: { session: DEMO_DATA.session },
      error: null,
    }
  }
  
  // Переопределяем getUser
  supabaseClient.auth.getUser = async () => {
    return {
      data: { user: DEMO_DATA.user },
      error: null,
    }
  }
  
  // Переопределяем signOut
  supabaseClient.auth.signOut = async () => {
    console.log('🎭 Demo logout')
    return { error: null }
  }
}

export const supabase = supabaseClient

// Вспомогательные функции
export const getSession = async (): Promise<Session | null> => {
  if (DEMO_MODE) {
    // Возвращаем демо-сессию
    return DEMO_DATA.session
  }
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.warn('Error getting session:', error.message)
      return null
    }
    return session
  } catch (error) {
    console.error('Error in getSession:', error)
    return null
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (DEMO_MODE) {
    // Возвращаем демо-пользователя
    return DEMO_DATA.user
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.warn('Error getting user:', error.message)
      return null
    }
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export const signIn = async (email: string, password: string) => {
  // Всегда используем переопределенный метод в демо-режиме
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

// Функция для получения пациентов
export const getPatients = async (limit = 10) => {
  if (DEMO_MODE) {
    // Возвращаем демо-пациентов
    return DEMO_DATA.patients.slice(0, limit)
  }
  
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.warn('Supabase error, using demo data:', error.message)
      return DEMO_DATA.patients.slice(0, limit)
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching patients:', error)
    return DEMO_DATA.patients.slice(0, limit)
  }
}

// Получение информации о подключении
export const getConnectionInfo = () => {
  return {
    isDemoMode: DEMO_MODE,
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Not configured',
    hasCredentials: !!(supabaseUrl && supabaseAnonKey),
    mode: DEMO_MODE ? 'demo' : 'production',
  }
}

// Экспортируем флаг демо-режима
export const isDemoMode = () => DEMO_MODE

// Дополнительные демо-функции
export const getPatientById = async (id: string) => {
  if (DEMO_MODE) {
    return DEMO_DATA.patients.find(p => p.id === id) || null
  }
  
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.warn('Error fetching patient, using demo data:', error)
    return DEMO_DATA.patients.find(p => p.id === id) || null
  }
}

export const createPatient = async (patientData: any) => {
  if (DEMO_MODE) {
    const newPatient = {
      ...patientData,
      id: `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    DEMO_DATA.patients.unshift(newPatient)
    console.log('🎭 Demo patient created:', newPatient)
    return { data: newPatient, error: null }
  }
  
  return await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single()
}

export const updatePatient = async (id: string, updates: any) => {
  if (DEMO_MODE) {
    const index = DEMO_DATA.patients.findIndex(p => p.id === id)
    if (index !== -1) {
      DEMO_DATA.patients[index] = { ...DEMO_DATA.patients[index], ...updates }
      console.log('🎭 Demo patient updated:', DEMO_DATA.patients[index])
      return { data: DEMO_DATA.patients[index], error: null }
    }
    return { data: null, error: new Error('Patient not found') }
  }
  
  return await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}
