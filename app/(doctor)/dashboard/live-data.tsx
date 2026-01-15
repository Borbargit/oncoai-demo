'use client'

import { useEffect, useState } from 'react'
import { getPatients } from '@/lib/supabase'
import { Users, Activity, TrendingUp } from 'lucide-react'

export function LivePatientsStats() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getPatients(10)
        setPatients(data)
      } catch (error) {
        console.error('Error loading patients:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPatients()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    recovering: patients.filter(p => p.status === 'recovering').length,
    critical: patients.filter(p => p.status === 'critical').length,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <Users className="w-5 h-5 text-blue-600" />
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>
        <p className="text-2xl font-bold mt-2">{stats.total}</p>
        <p className="text-sm text-gray-600">Всего пациентов</p>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <Activity className="w-5 h-5 text-green-600" />
          <span className="text-xs font-medium text-green-600">+{stats.active}</span>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.active}</p>
        <p className="text-sm text-gray-600">Активные</p>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <Activity className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-medium text-blue-600">+{stats.recovering}</span>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.recovering}</p>
        <p className="text-sm text-gray-600">Восстанавливаются</p>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <Activity className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-medium text-amber-600">+{stats.critical}</span>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.critical}</p>
        <p className="text-sm text-gray-600">Критические</p>
      </div>
    </div>
  )
}
