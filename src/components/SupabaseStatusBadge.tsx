'use client'

import { useEffect, useState } from 'react'
import { isDemoMode, getConnectionInfo } from '@/lib/supabase'
import { CheckCircle, Shield, AlertCircle } from 'lucide-react'

export default function SupabaseStatusBadge() {
  const [status, setStatus] = useState<{ mode: string; configured: boolean }>({ 
    mode: 'checking', 
    configured: false 
  })

  useEffect(() => {
    const info = getConnectionInfo()
    setStatus({
      mode: info.isDemoMode ? 'demo' : 'production',
      configured: info.hasCredentials
    })
  }, [])

  const getConfig = () => {
    if (status.mode === 'demo') {
      return {
        icon: <Shield className="w-4 h-4" />,
        text: 'Демо-режим',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        tooltip: 'Используются тестовые данные. Обновите .env.local для подключения к реальному Supabase.'
      }
    }
    
    if (status.configured) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Supabase подключен',
        color: 'text-green-600 bg-green-50 border-green-200',
        tooltip: 'Подключено к реальной базе данных Supabase'
      }
    }
    
    return {
      icon: <AlertCircle className="w-4 h-4" />,
      text: 'Не настроено',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      tooltip: 'Supabase не настроен. Добавьте ключи в .env.local'
    }
  }

  const config = getConfig()

  return (
    <div 
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm ${config.color}`}
      title={config.tooltip}
    >
      {config.icon}
      <span className="ml-2 font-medium">{config.text}</span>
    </div>
  )
}
