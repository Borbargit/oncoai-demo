'use client'

import { useState } from 'react'
import { LogIn, Mail, Lock, Eye, EyeOff, User, Stethoscope, CheckCircle } from 'lucide-react'
import { signIn, isDemoMode } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const { data, error: signInError } = await signIn(email, password)
      
      if (signInError) {
        // В демо-режиме ошибок быть не должно, но на всякий случай
        if (isDemoMode()) {
          // В демо-режиме игнорируем ошибки и считаем вход успешным
          setSuccess(true)
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 1000)
        } else {
          setError(signInError.message)
        }
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      }
    } catch (error: any) {
      setError('Произошла ошибка при входе')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: 'doctor' | 'admin') => {
    const demoEmail = role === 'doctor' ? 'doctor@onkoai.demo' : 'admin@onkoai.demo'
    setEmail(demoEmail)
    setPassword('demo123')
    
    // Автоматический вход через полсекунды
    setTimeout(() => {
      handleSubmit(new Event('submit') as any)
    }, 500)
  }

  const handleQuickLogin = () => {
    if (!email.trim()) {
      setEmail('demo@onkoai.demo')
    }
    if (!password.trim()) {
      setPassword('demo123')
    }
    
    setTimeout(() => {
      handleSubmit(new Event('submit') as any)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <div className="text-white text-3xl font-bold">O</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OnkoAI Demo
          </h1>
          <p className="text-gray-600 mt-2">Система поддержки принятия решений в онкологии</p>
          
          {isDemoMode() && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-pulse">
              <Stethoscope className="w-4 h-4 mr-2" />
              Демонстрационный режим активен
            </div>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-800">Вход выполнен успешно!</p>
                <p className="text-sm text-green-600 mt-1">Перенаправление на dashboard...</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
            <p className="text-gray-600 mt-1">
              {isDemoMode() 
                ? 'Используйте любые данные для входа' 
                : 'Введите ваши учетные данные'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Электронная почта
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isDemoMode() ? "любой@email.com" : "doctor@hospital.com"}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  disabled={isLoading || success}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isDemoMode() ? "любой пароль" : "••••••••"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading || success}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
                {isDemoMode() && (
                  <p className="text-red-600 text-xs mt-1">
                    В демо-режиме это сообщение не должно появляться. Используйте любые данные.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Вход...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Успешно!
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Войти в систему
                </>
              )}
            </button>
          </form>

          {/* Demo Mode Section */}
          {isDemoMode() && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">
                Быстрый доступ (демо-режим)
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleDemoLogin('doctor')}
                  disabled={isLoading || success}
                  className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-800">Врач</span>
                  <span className="text-xs text-blue-600 mt-1">doctor@onkoai.demo</span>
                </button>
                
                <button
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading || success}
                  className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-purple-800">Админ</span>
                  <span className="text-xs text-purple-600 mt-1">admin@onkoai.demo</span>
                </button>
              </div>
              
              <button
                onClick={handleQuickLogin}
                disabled={isLoading || success}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
              >
                Быстрый вход с любыми данными
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  В демо-режиме работают ЛЮБЫЕ email и пароль
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Просто нажмите "Войти в систему" с любыми данными
                </p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isDemoMode() 
                  ? '🎭 Демо-версия • Тестовые данные • Любой вход работает'
                  : '🔧 Производственная версия • Реальные данные'
                }
              </p>
              <div className="mt-3 flex justify-center space-x-4">
                <a 
                  href="/dashboard" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Продолжить без входа →
                </a>
                <a 
                  href="/test-supabase" 
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Проверить подключение
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 OnkoAI Demo • Система поддержки врачей-онкологов
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <span className="text-gray-400 text-xs">Версия 1.0.0</span>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Конфиденциальность</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Помощь</a>
          </div>
        </div>
      </div>
    </div>
  )
}
