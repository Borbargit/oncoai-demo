'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Calendar, Heart, Pill, Activity, FileText, Bell } from 'lucide-react'
import { getCurrentUser, signOut } from '@/lib/supabase'

export default function PatientPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      if (currentUser.user_metadata?.role !== 'patient') {
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

  const medicalData = {
    diagnosis: 'Рак легких',
    stage: 'IIA',
    lastVisit: '2024-01-15',
    nextVisit: '2024-02-15',
    doctor: 'Доктор Иванов',
    medications: [
      { name: 'Пеметрексед', dose: '500 мг', frequency: '1 раз в 3 недели' },
      { name: 'Карбоплатин', dose: 'AUC 5', frequency: '1 раз в 3 недели' },
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка личного кабинета...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Личный кабинет пациента</h1>
                <p className="text-sm text-gray-600">{user?.user_metadata?.name || 'Пациент'}</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Добро пожаловать, {user?.user_metadata?.name?.split(' ')[1] || 'Иван'}!</h2>
              <p className="opacity-90">Ваше здоровье под контролем наших специалистов и ИИ</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Medical Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Медицинская информация</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Activity className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">Диагноз</span>
                  </div>
                  <p className="text-lg font-semibold">{medicalData.diagnosis}</p>
                  <p className="text-sm text-gray-600">Стадия: {medicalData.stage}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium">Следующий визит</span>
                  </div>
                  <p className="text-lg font-semibold">{medicalData.nextVisit}</p>
                  <p className="text-sm text-gray-600">Врач: {medicalData.doctor}</p>
                </div>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Текущие назначения</h3>
                <Pill className="w-6 h-6 text-purple-600" />
              </div>
              
              <div className="space-y-4">
                {medicalData.medications.map((med, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {med.dose}
                      </span>
                    </div>
                    <p className="text-gray-600">Прием: {med.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Моя статистика</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Прогресс лечения</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Соблюдение назначений</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">AI Рекомендации</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <p className="text-sm">Контрольный анализ крови через 2 недели</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <p className="text-sm">Рекомендуется легкая физическая активность</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <p className="text-sm">Следующая КТ через 1 месяц</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Документы</h3>
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              
              <div className="space-y-3">
                <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <div className="font-medium">Выписка из истории болезни</div>
                  <div className="text-sm text-gray-600">Обновлено 15.01.2024</div>
                </button>
                <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <div className="font-medium">Результаты анализов</div>
                  <div className="text-sm text-gray-600">Обновлено 10.01.2024</div>
                </button>
                <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <div className="font-medium">Направления</div>
                  <div className="text-sm text-gray-600">Обновлено 05.01.2024</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
