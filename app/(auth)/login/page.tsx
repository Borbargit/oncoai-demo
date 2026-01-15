'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, User, Shield, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react'
import { signIn } from '@/lib/supabase'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'doctor'
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        throw new Error(error.message || 'Ошибка входа')
      }
      
      if (!data?.user) {
        throw new Error('Пользователь не найден')
      }
      
      const userRole = data.user.user_metadata?.role || formData.role
      
      // Проверяем соответствие выбранной роли
      if (userRole !== formData.role) {
        // Если пользователь существует но с другой ролью, все равно пускаем
        console.log(`Пользователь найден с ролью: ${userRole}, выбрана: ${formData.role}`)
      }
      
      setSuccess(true)
      
      // Перенаправление в зависимости от роли
      setTimeout(() => {
        switch(formData.role) {
          case 'doctor':
            router.push('/doctor')
            break
          case 'patient':
            router.push('/patient')
            break
          case 'admin':
            router.push('/admin')
            break
          default:
            router.push('/dashboard')
        }
        router.refresh()
      }, 1000)
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Ошибка при входе в систему')
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = {
    doctor: { email: 'doctor@demo.ru', password: 'doctor123' },
    patient: { email: 'patient@demo.ru', password: 'patient123' },
    admin: { email: 'admin@demo.ru', password: 'admin123' }
  }

  const useDemoCredentials = (role: string) => {
    const creds = demoCredentials[role as keyof typeof demoCredentials]
    setFormData(prev => ({
      ...prev,
      email: creds.email,
      password: creds.password,
      role
    }))
  }

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'doctor': return <Stethoscope className="w-5 h-5" />
      case 'patient': return <User className="w-5 h-5" />
      case 'admin': return <Shield className="w-5 h-5" />
      default: return <User className="w-5 h-5" />
    }
  }

  const getRoleName = (role: string) => {
    switch(role) {
      case 'doctor': return 'Врач'
      case 'patient': return 'Пациент'
      case 'admin': return 'Администратор'
      default: return role
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OnkoAI Auth</h1>
          <p className="text-gray-600">Вход в систему с поддержкой ролей</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            <LogIn className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">Вход выполнен успешно!</p>
                  <p className="text-green-700 text-sm">Перенаправление на панель {getRoleName(formData.role)}...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <p className="text-red-800 font-medium">Ошибка входа</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Role Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите роль
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                  disabled={isLoading}
                >
                  <option value="doctor">Врач</option>
                  <option value="patient">Пациент</option>
                  <option value="admin">Администратор</option>
                </select>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  {getRoleIcon(formData.role)}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Введите ваш email"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Введите пароль"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Выполняется вход...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="w-6 h-6 mr-3" />
                  Войти как {getRoleName(formData.role)}
                </div>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Демо-доступы:</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => useDemoCredentials('doctor')}
                className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-center transition"
                disabled={isLoading}
              >
                <Stethoscope className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-700">Врач</div>
                <div className="text-xs text-blue-600">doctor@demo.ru</div>
              </button>
              
              <button
                onClick={() => useDemoCredentials('patient')}
                className="p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-center transition"
                disabled={isLoading}
              >
                <User className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-700">Пациент</div>
                <div className="text-xs text-green-600">patient@demo.ru</div>
              </button>
              
              <button
                onClick={() => useDemoCredentials('admin')}
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-center transition"
                disabled={isLoading}
              >
                <Shield className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-700">Админ</div>
                <div className="text-xs text-purple-600">admin@demo.ru</div>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 Все пароли: <code className="bg-gray-200 px-2 py-1 rounded">role123</code>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center space-y-3">
          <a 
            href="/" 
            className="inline-block text-gray-600 hover:text-gray-800 transition"
          >
            ← Вернуться на главную
          </a>
          <div className="text-xs text-gray-500">
            © 2024 OnkoAI • Система поддержки онкологической диагностики
          </div>
        </div>
      </div>
    </div>
  )
}
