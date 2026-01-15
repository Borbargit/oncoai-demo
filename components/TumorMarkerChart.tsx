'use client'

import { Activity } from 'lucide-react'

interface TumorMarkerChartProps {
  patientId: string
}

export default function TumorMarkerChart({ patientId }: TumorMarkerChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Activity className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Динамика онкомаркеров</h3>
            <p className="text-gray-600">Для пациента ID: {patientId}</p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Activity className="w-10 h-10 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Демо-версия графика</h4>
          <p className="text-gray-500 text-center mb-6">
            В демо-режиме показан упрощенный вид<br />
            В реальной системе здесь будет интерактивный график
          </p>
          <div className="w-full h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-400">📊 График онкомаркеров</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Демонстрационные данные • Обновлено сегодня
          </div>
          <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            ДЕМО-РЕЖИМ
          </div>
        </div>
      </div>
    </div>
  )
}
