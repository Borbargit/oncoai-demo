'use client'

import { useState } from 'react'
import { LogIn, Mail, Lock, Eye, EyeOff, User, Stethoscope } from 'lucide-react'
import { signIn, isDemoMode } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error: signInError } = await signIn(email, password)
      
      if (signInError) {
        setError(signInError.message)
      } else {
        // Успешный вход
        if (isDemoMode()) {
          alert('🎭 Демо-режим: Вход выполнен успешно!')
        }
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      setError('Произошла ошибка при входе')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: 'doctor' | 'admin') => {
    setEmail(role === 'doctor' ? 'doctor@onkoai.demo' : 'admin@onkoai.demo')
    setPassword('demo123')
    
    // Автоматический вход через секунду
    setTimeout(() => {
      handleSubmit(new Event('submit') as any)
    }, 100)
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
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Stethoscope className="w-4 h-4 mr-2" />
              Демонстрационный режим
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
            <p className="text-gray-600 mt-1">Введите ваши учетные данные</p>
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
                  placeholder="doctor@hospital.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  disabled={isLoading}
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
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
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Вход...
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDemoLogin('doctor')}
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-purple-800">Админ</span>
                  <span className="text-xs text-purple-600 mt-1">admin@onkoai.demo</span>
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Используйте любые данные для входа в демо-режиме
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Пароль: demo123 (или любой другой)
                </p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isDemoMode() 
                  ? 'Демо-версия • Тестовые данные'
                  : 'Производственная версия • Реальные данные'
                }
              </p>
              <div className="mt-3">
                <a 
                  href="/dashboard" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Продолжить без входа →
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
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Конфиденциальность</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Условия</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Помощь</a>
          </div>
        </div>
      </div>
    </div>
  )
}
