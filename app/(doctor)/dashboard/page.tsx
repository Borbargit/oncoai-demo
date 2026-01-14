'use client'

import { useState } from 'react'
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Calendar,
  Activity,
  Brain,
  FileText,
  BarChart
} from 'lucide-react'
import PatientList from '@/components/PatientList'
import AIPanel from '@/components/AIPanel'

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: 'Всего пациентов', value: '142', change: '+12%', color: 'bg-blue-500' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Активные случаи', value: '23', change: '+5%', color: 'bg-green-500' },
    { icon: <Clock className="w-6 h-6" />, label: 'Ожидают анализа', value: '8', change: '-2%', color: 'bg-yellow-500' },
    { icon: <AlertCircle className="w-6 h-6" />, label: 'Срочные', value: '3', change: '+1%', color: 'bg-red-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Панель врача</h1>
          <p className="text-gray-600 mt-2">Добро пожаловать в систему OnkoAI Demo</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} за месяц
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['Обзор', 'Пациенты', 'Аналитика', 'Отчеты'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-2 px-1 font-medium text-sm border-b-2 transition ${
                    activeTab === tab.toLowerCase()
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Panel */}
            <AIPanel />

            {/* Patient List - БЕЗ ПРОПСОВ */}
            <PatientList />
          </div>

          {/* Right column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Статистика</h2>
                <BarChart className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Средний возраст</span>
                  <span className="font-semibold">48 лет</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Успешность лечения</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Среднее время анализа</span>
                  <span className="font-semibold">24 мин</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-700 transition flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Отчет
                </button>
                <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium text-green-700 transition flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Анализ ИИ
                </button>
                <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm font-medium text-purple-700 transition flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Назначить
                </button>
                <button className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-sm font-medium text-yellow-700 transition flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Мониторинг
                </button>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Расписание</h2>
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-3">
                {['Консультация в 10:00', 'Анализ КТ в 11:30', 'Совещание в 14:00', 'Прием пациентов'].map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-600 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
