// Улучшенный демо-клиент Supabase с поддержкой ролей

// Демо-данные пользователей
const DEMO_USERS = [
  {
    id: 'doctor-1',
    email: 'doctor@demo.ru',
    password: 'doctor123',
    role: 'doctor',
    name: 'Доктор Иванов',
    specialty: 'Онколог',
    hospital: 'Городская больница №1'
  },
  {
    id: 'patient-1', 
    email: 'patient@demo.ru',
    password: 'patient123',
    role: 'patient',
    name: 'Иванов Иван Петрович',
    age: 45,
    diagnosis: 'Рак легких'
  },
  {
    id: 'admin-1',
    email: 'admin@demo.ru',
    password: 'admin123',
    role: 'admin',
    name: 'Администратор Системы'
  }
]

// Демо-данные пациентов для врачей
const DEMO_PATIENTS = [
  {
    id: '1',
    name: 'Иванов Иван Петрович',
    age: 45,
    diagnosis: 'Рак легких',
    status: 'active',
    last_visit: '2024-01-15',
    doctor_id: 'doctor-1'
  },
  {
    id: '2', 
    name: 'Петрова Анна Сергеевна',
    age: 52,
    diagnosis: 'Рак молочной железы',
    status: 'recovering', 
    last_visit: '2024-01-10',
    doctor_id: 'doctor-1'
  },
  {
    id: '3', 
    name: 'Сидоров Петр Дмитриевич',
    age: 38,
    diagnosis: 'Меланома',
    status: 'critical', 
    last_visit: '2024-01-05',
    doctor_id: 'doctor-1'
  },
]

// Текущая сессия
let currentSession: any = null

// Вспомогательная функция для симуляции Supabase запросов
function createQueryBuilder(table: string) {
  const tableData: any = {
    patients: DEMO_PATIENTS,
    users: DEMO_USERS
  }[table] || []

  return {
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        order: (orderBy: string, options: any = { ascending: true }) => ({
          limit: async (count: number) => ({
            data: tableData
              .filter((item: any) => item[column] === value)
              .slice(0, count),
            error: null,
          }),
          single: async () => ({
            data: tableData.find((item: any) => item[column] === value) || null,
            error: null,
          })
        }),
        limit: async (count: number) => ({
          data: tableData
            .filter((item: any) => item[column] === value)
            .slice(0, count),
          error: null,
        })
      }),
      order: (orderBy: string, options: any = { ascending: false }) => ({
        limit: async (count: number) => ({
          data: [...tableData]
            .sort((a, b) => options.ascending 
              ? a[orderBy] > b[orderBy] ? 1 : -1 
              : a[orderBy] < b[orderBy] ? 1 : -1
            )
            .slice(0, count),
          error: null,
        })
      })
    }),
    insert: async (data: any) => ({ data, error: null }),
    update: async (data: any) => ({ data, error: null })
  }
}

// Экспортируем клиент с поддержкой ролей
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      console.log(`🔐 Попытка входа: ${email}`)
      
      // Находим пользователя
      const user = DEMO_USERS.find(u => 
        u.email === email && u.password === password
      )
      
      if (user) {
        // Создаем сессию
        currentSession = {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: { 
              name: user.name,
              role: user.role
            }
          },
          access_token: `demo-token-${user.id}`,
          refresh_token: `demo-refresh-${user.id}`,
          expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 дней
        }
        
        // Сохраняем в localStorage для совместимости
        if (typeof window !== 'undefined') {
          localStorage.setItem('supabase.auth.token', JSON.stringify(currentSession))
          localStorage.setItem('user-role', user.role)
          localStorage.setItem('user-name', user.name)
          localStorage.setItem('user-email', user.email)
        }
        
        return {
          data: {
            user: {
              id: user.id,
              email: user.email,
              user_metadata: {
                name: user.name,
                role: user.role
              }
            },
            session: currentSession
          },
          error: null
        }
      } else {
        return {
          data: { user: null, session: null },
          error: { 
            message: 'Неверный email или пароль',
            status: 400
          }
        }
      }
    },
    
    getSession: async () => {
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('supabase.auth.token')
          if (token) {
            currentSession = JSON.parse(token)
          }
        } catch (e) {
          currentSession = null
        }
      }
      
      return {
        data: { session: currentSession },
        error: null
      }
    },
    
    getUser: async () => ({
      data: { 
        user: currentSession?.user || null 
      }, 
      error: null 
    }),
    
    signOut: async () => {
      currentSession = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('user-role')
        localStorage.removeItem('user-name')
        localStorage.removeItem('user-email')
      }
      return { error: null }
    },
  },
  
  from: (table: string) => createQueryBuilder(table),
}

// Вспомогательные функции
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getPatients = async (limit = 10) => {
  try {
    const session = await getSession()
    const role = session?.user?.user_metadata?.role
    
    if (role === 'doctor') {
      // Врач видит своих пациентов
      return DEMO_PATIENTS.filter(p => p.doctor_id === session.user.id).slice(0, limit)
    } else if (role === 'patient') {
      // Пациент видит только себя
      const currentPatient = DEMO_PATIENTS.find(p => 
        p.name.toLowerCase().includes(session?.user?.user_metadata?.name?.toLowerCase() || '')
      )
      return currentPatient ? [currentPatient] : []
    } else if (role === 'admin') {
      // Админ видит всех пациентов
      return DEMO_PATIENTS.slice(0, limit)
    }
    
    return []
  } catch (error) {
    console.error('Error getting patients:', error)
    return DEMO_PATIENTS.slice(0, limit)
  }
}

export const getConnectionInfo = () => ({
  isDemoMode: true,
  supabaseUrl: 'demo-mode',
  hasCredentials: false,
  mode: 'demo' as const,
})

export const isDemoMode = () => true

// Функция для получения текущей роли
export const getCurrentUserRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user-role') || null
  }
  return null
}

// Функция для получения имени пользователя
export const getCurrentUserName = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user-name') || 'Пользователь'
  }
  return 'Пользователь'
}

// Функция для установки cookies (для использования в браузере)
export const setAuthCookies = (user: any) => {
  if (typeof window !== 'undefined' && user) {
    document.cookie = `user-role=${user.user_metadata?.role || 'guest'}; path=/; max-age=${7 * 24 * 60 * 60}`
    document.cookie = `user-name=${encodeURIComponent(user.user_metadata?.name || 'Пользователь')}; path=/; max-age=${7 * 24 * 60 * 60}`
  }
}

// Обновляем функцию signIn
export const enhancedSignIn = async (email: string, password: string) => {
  const result = await signIn(email, password)
  
  if (result.data?.user && typeof window !== 'undefined') {
    setAuthCookies(result.data.user)
  }
  
  return result
}
