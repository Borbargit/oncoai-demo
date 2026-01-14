import { createClient } from '@supabase/supabase-js'

// Получаем переменные окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Проверяем наличие переменных окружения (только в development)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL или Anon Key не найдены. Убедитесь, что они добавлены в .env.local'
  )
}

// Создаем и экспортируем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
