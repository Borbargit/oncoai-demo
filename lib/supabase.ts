// Простейший демо-клиент Supabase для OnkoAI Demo

// Демо-данные
const DEMO_DATA: any = {
  patients: [
    {
      id: '1',
      name: 'Иванов Иван Петрович',
      age: 45,
      diagnosis: 'Рак легких',
      status: 'active',
      last_visit: '2024-01-15',
      created_at: '2024-01-01T10:00:00Z'
    },
    {
      id: '2', 
      name: 'Петрова Анна Сергеевна',
      age: 52,
      diagnosis: 'Рак молочной железы',
      status: 'recovering', 
      last_visit: '2024-01-10',
      created_at: '2024-01-02T11:00:00Z'
    },
    {
      id: '3', 
      name: 'Сидоров Петр Дмитриевич',
      age: 38,
      diagnosis: 'Меланома',
      status: 'critical', 
      last_visit: '2024-01-05',
      created_at: '2024-01-03T12:00:00Z'
    },
  ],
  ai_recommendations: [
    {
      id: '1',
      patient_id: '1',
      recommendations: [
        'Рассмотреть таргетную терапию на основе мутаций EGFR',
        'Контроль уровня CEA каждые 2 недели',
        'Повторная КТ через 1 месяц для оценки ответа на терапию'
      ],
      confidence: 0.92,
      created_at: '2024-01-15T10:30:00Z',
      model_version: 'onkoai-v2.1'
    },
    {
      id: '2',
      patient_id: '2',
      recommendations: [
        'Комбинация иммунотерапии с химиотерапией',
        'Мониторинг уровня CA 15-3 каждые 3 недели',
        'Консультация радиотерапевта для оценки возможности локальной терапии'
      ],
      confidence: 0.88,
      created_at: '2024-01-14T14:45:00Z',
      model_version: 'onkoai-v2.1'
    }
  ],
  tumor_markers: [
    { id: '1', patient_id: '1', date: '2023-11-01', cea: 5.2, ca19_9: 35, psa: null, ca125: null },
    { id: '2', patient_id: '1', date: '2023-11-15', cea: 6.8, ca19_9: 42, psa: null, ca125: null },
    { id: '3', patient_id: '1', date: '2023-12-01', cea: 8.1, ca19_9: 55, psa: null, ca125: null },
    { id: '4', patient_id: '2', date: '2023-11-01', cea: null, ca19_9: null, psa: null, ca125: 45 },
    { id: '5', patient_id: '2', date: '2023-11-15', cea: null, ca19_9: null, psa: null, ca125: 38 },
  ]
}

// Вспомогательная функция для симуляции Supabase запросов
function createQueryBuilder(table: string) {
  const tableData = DEMO_DATA[table] || []
  
  return {
    select: () => ({
      eq: (column: string, value: any) => ({
        order: (orderBy: string, options: any = { ascending: true }) => ({
          limit: async (count: number) => {
            const filtered = tableData.filter((item: any) => item[column] === value)
            const sorted = [...filtered].sort((a, b) => {
              if (options.ascending) {
                return a[orderBy] > b[orderBy] ? 1 : -1
              } else {
                return a[orderBy] < b[orderBy] ? 1 : -1
              }
            })
            return {
              data: sorted.slice(0, count),
              error: null,
            }
          },
          single: async () => ({
            data: tableData.find((item: any) => item[column] === value) || null,
            error: null,
          })
        }),
        limit: async (count: number) => ({
          data: tableData.filter((item: any) => item[column] === value).slice(0, count),
          error: null,
        })
      }),
      order: (orderBy: string, options: any = { ascending: false }) => ({
        limit: async (count: number) => {
          const sorted = [...tableData].sort((a, b) => {
            if (options.ascending) {
              return a[orderBy] > b[orderBy] ? 1 : -1
            } else {
              return a[orderBy] < b[orderBy] ? 1 : -1
            }
          })
          return {
            data: sorted.slice(0, count),
            error: null,
          }
        }
      })
    }),
    insert: async (data: any) => ({
      data,
      error: null
    }),
    update: async (data: any) => ({
      data,
      error: null
    })
  }
}

// Экспортируем пустой клиент для совместимости
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      console.log(`🎭 Demo login: ${email || 'demo@onkoai.com'}`)
      return {
        data: {
          user: { 
            id: 'demo-user', 
            email: email || 'demo@onkoai.com',
            user_metadata: { name: 'Доктор Демо' }
          },
          session: { 
            access_token: 'demo-token',
            user: { id: 'demo-user', email: email || 'demo@onkoai.com' }
          }
        },
        error: null
      }
    },
    getSession: async () => ({ 
      data: { 
        session: { 
          user: { 
            id: 'demo-user', 
            email: 'demo@onkoai.com',
            user_metadata: { name: 'Доктор Демо' }
          } 
        } 
      }, 
      error: null 
    }),
    getUser: async () => ({ 
      data: { 
        user: { 
          id: 'demo-user', 
          email: 'demo@onkoai.com',
          user_metadata: { name: 'Доктор Демо' }
        } 
      }, 
      error: null 
    }),
    signOut: async () => ({ error: null }),
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
    // Используем демо-режим напрямую
    return DEMO_DATA.patients.slice(0, limit)
  } catch (error) {
    // Всегда возвращаем демо-данные
    return DEMO_DATA.patients.slice(0, limit)
  }
}

export const getConnectionInfo = () => ({
  isDemoMode: true,
  supabaseUrl: 'demo-mode',
  hasCredentials: false,
  mode: 'demo' as const,
})

export const isDemoMode = () => true
