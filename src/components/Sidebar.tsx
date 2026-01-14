'use client'

import { Home, Users, FileText, BarChart, Settings, LogOut, Bell, HelpCircle } from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: <Home className="w-5 h-5" />, label: 'Главная', active: true },
  { icon: <Users className="w-5 h-5" />, label: 'Пациенты' },
  { icon: <FileText className="w-5 h-5" />, label: 'Отчеты' },
  { icon: <BarChart className="w-5 h-5" />, label: 'Аналитика' },
  { icon: <Settings className="w-5 h-5" />, label: 'Настройки' },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Главная')

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">OnkoAI</h1>
            <p className="text-xs text-gray-500">Демо-версия</p>
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
            ДВ
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Доктор Иванов</h3>
            <p className="text-sm text-gray-500">Онколог</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-500">В сети</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => setActiveItem(item.label)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  activeItem === item.label
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Notifications & Help */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5 mr-3" />
            <span className="font-medium">Уведомления</span>
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <HelpCircle className="w-5 h-5 mr-3" />
            <span className="font-medium">Помощь</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </div>
  )
}
