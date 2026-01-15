'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, Users, Settings, Database, 
  BarChart, Activity, Key, Bell, LogOut 
} from 'lucide-react'
import { getCurrentUser, signOut, getCurrentUserName } from '@/lib/supabase'

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeDoctors: 24,
    totalPatients: 132,
    aiRequests: 543
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      setUser(currentUser)
      setLoading(false)
    }
    
    loadData()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка панели администратора...</p>
        </div>
      </div>
    )
  }

  const userName = getCurrentUserName()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Администратор: {userName}</h1>
                <p className="text-sm text-gray-600">Панель управления системой</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего пользователей</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Активные врачи</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeDoctors}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Пациенты</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI запросы</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.aiRequests}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <BarChart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* System Health */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Состояние системы</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">База данных</span>
                    <span className="text-green-600 font-medium">✓ Работает</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">AI Модели</span>
                    <span className="text-green-600 font-medium">✓ Активны</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">API Скорость</span>
                    <span className="text-green-600 font-medium">142 мс</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Последние действия</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Новый врач зарегистрирован</p>
                    <p className="text-sm text-gray-600">Доктор Петров • 10 минут назад</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Database className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Резервное копирование БД</p>
                    <p className="text-sm text-gray-600">Успешно завершено • 2 часа назад</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Обновление AI моделей</p>
                    <p className="text-sm text-gray-600">v2.1 → v2.2 • 5 часов назад</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Быстрые действия</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  Управление пользователями
                </button>
                <button className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-left flex items-center">
                  <Database className="w-5 h-5 mr-3" />
                  Резервное копирование
                </button>
                <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-left flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  Настройки системы
                </button>
                <button className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-left flex items-center">
                  <BarChart className="w-5 h-5 mr-3" />
                  Аналитика и отчеты
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Информация о системе</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Версия</span>
                  <span className="font-mono">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Режим</span>
                  <span className="text-green-400">Демонстрационный</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Дата развертывания</span>
                  <span>2024-01-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Статус</span>
                  <span className="text-green-400">✓ Активна</span>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Безопасность</h3>
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium">Аутентификация</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Все сессии активны</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="font-medium">Логи доступа</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Требуется очистка через 7 дней</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Демо-режим администратора</h3>
              <p className="opacity-90">Это демонстрационная версия панели администратора системы OnkoAI.</p>
              <p className="opacity-80 text-sm mt-1">В реальной системе здесь будут доступны все инструменты управления.</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm">
              ДЕМО ВЕРСИЯ
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
