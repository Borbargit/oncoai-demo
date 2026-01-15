'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Sparkles, Stethoscope, CheckCircle, Brain } from 'lucide-react'
import { signIn } from '@/lib/supabase'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    
    try {
      // Используем любые данные для входа
      await signIn('demo@onkoai.com', 'demo123')
      setSuccess(true)
      
      // Перенаправление через 1 секунду
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1000)
      
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* Demo Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 mr-2" />
          <span className="font-bold">ДЕМО ВЕРСИЯ</span>
        </div>

        {/* Logo */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">OnkoAI Demo</h1>
        <p className="text-gray-600 mb-8">Демонстрационная система поддержки врачей-онкологов</p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Вход выполнен успешно!</span>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            <Stethoscope className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Демо-доступ</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Это демонстрационная версия системы. Нажмите кнопку ниже для автоматического входа.
          </p>

          <button
            onClick={handleLogin}
            disabled={isLoading || success}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Вход в систему...
              </div>
            ) : success ? (
              <div className="flex items-center justify-center">
                <CheckCircle className="w-6 h-6 mr-3" />
                Успешно! Перенаправление...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-6 h-6 mr-3" />
                Войти в демо-систему
              </div>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              💡 Особенности демо-версии:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li className="flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                Работает полностью локально
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                Не требует реальных данных
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                Все функции доступны
              </li>
            </ul>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <a 
            href="/dashboard" 
            className="inline-block px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition"
          >
            Перейти прямо в панель управления
          </a>
          <br />
          <a 
            href="/test-supabase" 
            className="inline-block text-gray-600 hover:text-gray-800 text-sm"
          >
            Посмотреть тестовые данные →
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 OnkoAI Demo • Версия 1.0.0
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Система искусственного интеллекта для поддержки онкологической диагностики
          </p>
        </div>
      </div>
    </div>
  )
}
