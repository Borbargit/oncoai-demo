'use client'
import { LivePatientsStats } from './live-data'
import SupabaseStatusBadge from '@/components/SupabaseStatusBadge'

import { useState } from 'react'
import { 
  Users, 
  Activity, 
  BarChart3, 
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  Shield,
  Brain,
  FileText,
  MessageSquare,
  Bell,
  Search,
  ChevronRight,
  PlayCircle,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react'

const stats = [
  { 
    icon: <Users className="w-6 h-6" />, 
    label: 'Всего пациентов', 
    value: '142', 
    change: '+12%', 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
  },
  { 
    icon: <Activity className="w-6 h-6" />, 
    label: 'Активные случаи', 
    value: '23', 
    change: '+5%', 
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50'
  },
  { 
    icon: <Clock className="w-6 h-6" />, 
    label: 'Ожидают анализа', 
    value: '8', 
    change: '-2%', 
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50'
  },
  { 
    icon: <AlertTriangle className="w-6 h-6" />, 
    label: 'Срочные', 
    value: '3', 
    change: '+1%', 
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-gradient-to-br from-rose-50 to-red-50'
  },
]

const recentPatients = [
  { 
    id: 1, 
    name: 'Александр Петров', 
    age: 45, 
    diagnosis: 'Рак легких', 
    status: 'critical', 
    time: '10 мин назад',
    avatarColor: 'bg-blue-100 text-blue-600'
  },
  { 
    id: 2, 
    name: 'Мария Иванова', 
    age: 52, 
    diagnosis: 'Рак молочной железы', 
    status: 'active', 
    time: '25 мин назад',
    avatarColor: 'bg-purple-100 text-purple-600'
  },
  { 
    id: 3, 
    name: 'Дмитрий Смирнов', 
    age: 38, 
    diagnosis: 'Меланома', 
    status: 'recovering', 
    time: '1 час назад',
    avatarColor: 'bg-emerald-100 text-emerald-600'
  },
  { 
    id: 4, 
    name: 'Ольга Кузнецова', 
    age: 61, 
    diagnosis: 'Колоректальный рак', 
    status: 'active', 
    time: '2 часа назад',
    avatarColor: 'bg-amber-100 text-amber-600'
  },
]

const aiInsights = [
  { title: 'Высокая эффективность иммунотерапии', confidence: 92, trend: 'up' },
  { title: 'Рекомендована корректировка дозировки', confidence: 87, trend: 'stable' },
  { title: 'Риск рецидива снижен', confidence: 78, trend: 'up' },
  { title: 'Требуется дополнительное обследование', confidence: 65, trend: 'down' },
]

export default function ModernDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    OnkoAI
                  </h1>
                  <p className="text-xs text-gray-500">Intelligence Platform</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-1 ml-8">
                {['Обзор', 'Пациенты', 'Аналитика', 'Отчеты', 'Календарь'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item.toLowerCase())}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === item.toLowerCase()
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск пациентов, анализов..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  ДИ
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-gray-900">Доктор Иванов</p>
                  <p className="text-sm text-gray-500">Ведущий онколог</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Добро пожаловать, Доктор Иванов! 👋
                  </h2>
                  <p className="text-gray-600">
                    Сегодня у вас запланировано 4 консультации и 2 анализа ИИ
                  </p>
                </div>
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Начать день
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.bgColor} border border-gray-200/50 rounded-2xl p-6 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      stat.change.startsWith('+') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <TrendingUp className={`w-3 h-3 mr-1 ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`} />
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Patients */}
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Последние пациенты</h3>
                      <p className="text-gray-600 text-sm">Обновлено только что</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                        <Filter className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200/50">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl ${patient.avatarColor} flex items-center justify-center font-bold`}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                patient.status === 'active' ? 'bg-green-100 text-green-800' :
                                patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {patient.status === 'active' ? 'Активный' :
                                 patient.status === 'critical' ? 'Критический' : 'Восстановление'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{patient.diagnosis} • {patient.age} лет</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{patient.time}</span>
                          <button className="text-blue-600 hover:text-blue-800">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t border-gray-200/50">
                  <button className="w-full py-3 text-center text-blue-600 hover:text-blue-800 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                    Показать всех пациентов →
                  </button>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-6 h-6" />
                      <h3 className="text-xl font-bold">ИИ-Аналитика</h3>
                    </div>
                    <p className="text-blue-100">Инсайты на основе последних данных</p>
                  </div>
                  <Shield className="w-8 h-8 text-white/50" />
                </div>
                
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{insight.title}</span>
                        <span className="font-bold">{insight.confidence}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full"
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                        <div className="ml-4">
                          {insight.trend === 'up' && (
                            <TrendingUp className="w-4 h-4 text-emerald-300" />
                          )}
                          {insight.trend === 'down' && (
                            <TrendingUp className="w-4 h-4 text-rose-300 rotate-180" />
                          )}
                          {insight.trend === 'stable' && (
                            <Activity className="w-4 h-4 text-amber-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-colors">
                  Запросить глубокий анализ
                </button>
              </div>
            </div>

            {/* Right Column - 1/3 */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <MessageSquare className="w-5 h-5" />, label: 'Чат с ИИ', color: 'bg-blue-500' },
                    { icon: <FileText className="w-5 h-5" />, label: 'Новый отчет', color: 'bg-emerald-500' },
                    { icon: <Users className="w-5 h-5" />, label: 'Добавить пациента', color: 'bg-purple-500' },
                    { icon: <BarChart3 className="w-5 h-5" />, label: 'Анализ данных', color: 'bg-amber-500' },
                    { icon: <Calendar className="w-5 h-5" />, label: 'Расписание', color: 'bg-rose-500' },
                    { icon: <Download className="w-5 h-5" />, label: 'Экспорт', color: 'bg-cyan-500' },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <div className="text-white">
                          {action.icon}
                        </div>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upcoming Schedule */}
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Ближайшие события</h3>
                    <p className="text-gray-600 text-sm">Сегодня, 15 января</p>
                  </div>
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { time: '10:00', title: 'Консультация с пациентом', type: 'consultation' },
                    { time: '11:30', title: 'Анализ КТ снимков', type: 'analysis' },
                    { time: '14:00', title: 'Совещание отделения', type: 'meeting' },
                    { time: '16:30', title: 'Обзор новых случаев', type: 'review' },
                  ].map((event, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50/50 rounded-xl transition-colors">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${
                          event.type === 'consultation' ? 'bg-blue-50 text-blue-600' :
                          event.type === 'analysis' ? 'bg-purple-50 text-purple-600' :
                          event.type === 'meeting' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          <span className="font-bold">{event.time.split(':')[0]}</span>
                          <span className="text-xs">{event.time.split(':')[1]}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.time} • 45 минут</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-3 text-center text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  Показать полное расписание
                </button>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Статус системы</h3>
                    <p className="text-gray-400 text-sm">Все системы работают</p>
                  </div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { service: 'ИИ-модели', status: 'online', latency: '42ms' },
                    { service: 'База данных', status: 'online', latency: '18ms' },
                    { service: 'API Gateway', status: 'online', latency: '67ms' },
                    { service: 'Хранилище', status: 'online', latency: '124ms' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}></div>
                        <span className="font-medium">{item.service}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{item.latency}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Последнее обновление</span>
                    <span className="text-gray-300">2 минуты назад</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-200/50 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>OnkoAI Demo v1.0.0</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Только для демонстрационных целей</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>© 2024 OnkoAI</span>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Конфиденциальность</a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Помощь</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
