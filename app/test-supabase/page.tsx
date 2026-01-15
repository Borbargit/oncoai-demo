'use client'

import { useEffect, useState } from 'react'
import { 
  getPatients, 
  getSession, 
  isDemoMode, 
  getConnectionInfo 
} from '@/lib/supabase'
import { CheckCircle, XCircle, Database, User, Activity, Shield } from 'lucide-react'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'demo' | 'error'>('checking')
  const [patients, setPatients] = useState<any[]>([])
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [connectionInfo, setConnectionInfo] = useState<any>(null)

  useEffect(() => {
    async function testEverything() {
      try {
        setLoading(true)
        
        // 1. Проверка подключения и режима
        const info = getConnectionInfo()
        setConnectionInfo(info)
        
        if (info.isDemoMode) {
          setConnectionStatus('demo')
        } else {
          setConnectionStatus('connected')
        }

        // 2. Проверка сессии
        const userSession = await getSession()
        setSession(userSession)

        // 3. Получение данных пациентов
        const patientsData = await getPatients(5)
        setPatients(patientsData)

      } catch (error: any) {
        console.error('Test error:', error)
        setConnectionStatus('error')
      } finally {
        setLoading(false)
      }
    }

    testEverything()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200'
      case 'demo': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5" />
      case 'demo': return <Shield className="w-5 h-5" />
      case 'error': return <XCircle className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Подключено к Supabase'
      case 'demo': return 'Демо-режим (тестовые данные)'
      case 'error': return 'Ошибка подключения'
      default: return 'Проверка...'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Тест подключения Supabase</h1>
          <p className="text-gray-600">Демо-режим: Используются тестовые данные</p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl border ${getStatusColor(connectionStatus)} transition-all`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(connectionStatus)}
              <h3 className="text-lg font-semibold">Статус подключения</h3>
            </div>
            <p className="mb-4">{getStatusText(connectionStatus)}</p>
            {connectionInfo && (
              <div className="text-sm space-y-1">
                <p>Режим: <span className="font-medium">{connectionInfo.isDemoMode ? 'Демо' : 'Продакшн'}</span></p>
                <p>URL: <span className="font-mono text-xs">{connectionInfo.supabaseUrl}</span></p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Аутентификация</h3>
            </div>
            {session ? (
              <div>
                <p className="font-medium text-gray-900">{session.user?.email || 'demo@onkoai.com'}</p>
                <p className="text-sm text-gray-600">Сессия активна (демо)</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">Демо-пользователь</p>
                <p className="text-sm text-gray-500">Используются тестовые данные</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Данные</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            <p className="text-gray-600">пациентов загружено (демо)</p>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Тестовые данные пациентов</h2>
            <p className="text-gray-600">Данные из демо-режима</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Пациент</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Возраст</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Диагноз</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Статус</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Последний визит</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{patient.age} лет</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium">{patient.diagnosis}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'active' ? 'bg-green-100 text-green-800' :
                        patient.status === 'recovering' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {patient.status === 'active' ? 'Активный' :
                         patient.status === 'recovering' ? 'Восстановление' : 'Критический'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{patient.last_visit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {patients.length === 0 && !loading && (
            <div className="p-8 text-center">
              <p className="text-gray-500">Нет данных для отображения</p>
            </div>
          )}

          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-500">Загрузка демо-данных...</p>
            </div>
          )}
        </div>

        {/* Technical Info */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Техническая информация</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Конфигурация</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Режим:</span>
                  <span className="text-green-400">Демонстрационный</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Аутентификация:</span>
                  <span>Демо (всегда успешна)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Данные:</span>
                  <span>Тестовые (в памяти)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Особенности</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Работает без интернета</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Любой логин/пароль работают</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Идеально для демонстраций</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a 
            href="/dashboard" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            Перейти в Dashboard
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition"
          >
            Обновить данные
          </button>
          <a 
            href="/api/ai/classify" 
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
            target="_blank"
          >
            Тест API
          </a>
        </div>
      </div>
    </div>
  )
}
