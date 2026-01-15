'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Stethoscope, Users, Calendar, FileText, 
  Bell, Search, Plus, Activity, TrendingUp 
} from 'lucide-react'
import { getCurrentUser, signOut, getPatients } from '@/lib/supabase'

export default function DoctorPage() {
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      if (currentUser.user_metadata?.role !== 'doctor') {
        router.push('/login')
        return
      }
      
      setUser(currentUser)
      
      // Загружаем пациентов
      const patientsData = await getPatients()
      setPatients(patientsData)
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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка панели врача...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Панель врача</h1>
                <p className="text-sm text-gray-600">{user?.user_metadata?.name || 'Врач'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего пациентов</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{patients.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">На сегодня</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Требуют внимания</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Записи к ИИ</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Мои пациенты</h2>
                <p className="text-gray-600">Список пациентов под вашим наблюдением</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Новый пациент
              </button>
            </div>
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
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">ID: {patient.id}</div>
                        </div>
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
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm">
                          Карта
                        </button>
                        <button className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm">
                          Назначения
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {patients.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Нет пациентов</h3>
              <p className="text-gray-500">У вас пока нет пациентов под наблюдением</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Быстрый доступ</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-lg text-left flex items-center">
                <FileText className="w-5 h-5 mr-3" />
                Новая запись в карту
              </button>
              <button className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-lg text-left flex items-center">
                <Activity className="w-5 h-5 mr-3" />
                AI-анализ пациента
              </button>
              <button className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-lg text-left flex items-center">
                <TrendingUp className="w-5 h-5 mr-3" />
                Отчет по эффективности
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Недавняя активность</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Добавлена новая запись в карту пациента</p>
                  <p className="text-sm text-gray-600">Иванов И.П. • 10 минут назад</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">AI рекомендовал новую терапию</p>
                  <p className="text-sm text-gray-600">Петрова А.С. • 1 час назад</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
