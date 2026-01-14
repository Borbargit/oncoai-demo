'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AIPanelProps {
  onAnalyze: (module: string) => Promise<void>
  patientId: string
}

const aiModules = [
  { id: 'diagnosis', name: 'Диагностика', icon: '🔍', color: 'bg-blue-100' },
  { id: 'prognosis', name: 'Прогноз', icon: '📈', color: 'bg-green-100' },
  { id: 'treatment', name: 'Лечение', icon: '💊', color: 'bg-purple-100' },
  { id: 'monitoring', name: 'Наблюдение', icon: '📅', color: 'bg-yellow-100' }
]

export default function AIPanel({ onAnalyze, patientId }: AIPanelProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (moduleId: string) => {
    setLoading(true)
    await onAnalyze(moduleId)
    await fetchRecommendations()
    setLoading(false)
  }

  const fetchRecommendations = async () => {
    const { data } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
    
    if (data) setRecommendations(data)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Модули ИИ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aiModules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleAnalyze(module.id)}
              disabled={loading}
              className={`${module.color} p-4 rounded-lg text-center hover:opacity-90 transition disabled:opacity-50`}
            >
              <div className="text-2xl mb-2">{module.icon}</div>
              <div className="font-medium">{module.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Рекомендации ИИ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Рекомендации ИИ</h3>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between">
                <span className="font-medium">{rec.module.toUpperCase()}</span>
                <span className="text-sm text-gray-500">
                  Достоверность: {Math.round(rec.confidence * 100)}%
                </span>
              </div>
              <p className="mt-1">{rec.recommendation}</p>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(rec.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Нет рекомендаций. Запустите анализ ИИ.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
