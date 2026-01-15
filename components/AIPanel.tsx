'use client'

import { useState, useEffect } from 'react'
import { Brain, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

// Демо-данные рекомендаций ИИ
const DEMO_RECOMMENDATIONS = [
  {
    id: '1',
    patient_id: '1',
    recommendations: [
      'Рассмотреть таргетную терапию на основе мутаций EGFR',
      'Контроль уровня CEA каждые 2 недели',
      'Повторная КТ через 1 месяц для оценки ответа на терапию'
    ],
    confidence: 0.92,
    created_at: '2024-01-15T10:30:00Z',
    model_version: 'onkoai-v2.1'
  },
  {
    id: '2',
    patient_id: '2',
    recommendations: [
      'Комбинация иммунотерапии с химиотерапией',
      'Мониторинг уровня CA 15-3 каждые 3 недели',
      'Консультация радиотерапевта для оценки возможности локальной терапии'
    ],
    confidence: 0.88,
    created_at: '2024-01-14T14:45:00Z',
    model_version: 'onkoai-v2.1'
  },
  {
    id: '3',
    patient_id: '3',
    recommendations: [
      'Рассмотреть таргетную терапию BRAF-ингибиторами',
      'Мониторинг уровня LDH еженедельно',
      'Консультация клинического генетика для оценки наследственной предрасположенности'
    ],
    confidence: 0.95,
    created_at: '2024-01-13T09:15:00Z',
    model_version: 'onkoai-v2.1'
  }
]

// Определяем интерфейс для пропсов
interface AIPanelProps {
  patientId: string;
}

export default function AIPanel(props: AIPanelProps) {
  const { patientId } = props;
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRec, setSelectedRec] = useState<any>(null)

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true)
      
      try {
        // В демо-режиме используем локальные данные
        const patientRecommendations = DEMO_RECOMMENDATIONS.filter(
          rec => rec.patient_id === patientId
        )
        
        if (patientRecommendations.length > 0) {
          setRecommendations(patientRecommendations)
          setSelectedRec(patientRecommendations[0])
        } else {
          // Если нет данных для этого пациента, используем первую запись
          setRecommendations([DEMO_RECOMMENDATIONS[0]])
          setSelectedRec(DEMO_RECOMMENDATIONS[0])
        }
        
      } catch (error) {
        console.error('Error loading AI recommendations:', error)
        // В случае ошибки всё равно показываем демо-данные
        setRecommendations([DEMO_RECOMMENDATIONS[0]])
        setSelectedRec(DEMO_RECOMMENDATIONS[0])
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [patientId])

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.8) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Загрузка рекомендаций ИИ...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Рекомендации</h3>
              <p className="text-blue-100 text-sm">OnkoAI v2.1 • Демо-режим</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Уверенность модели</div>
            <div className={`text-2xl font-bold ${getConfidenceColor(selectedRec?.confidence || 0)}`}>
              {selectedRec ? Math.round(selectedRec.confidence * 100) : 85}%
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Recommendation Selector */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {recommendations.map((rec) => (
              <button
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedRec?.id === rec.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(rec.created_at)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Recommendation */}
        {selectedRec && (
          <div className="space-y-6">
            {/* Recommendations List */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-900">Рекомендации</h4>
              </div>
              
              <ul className="space-y-3">
                {selectedRec.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Model Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <Brain className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Версия модели</span>
                </div>
                <div className="font-mono text-gray-900">{selectedRec.model_version}</div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Уверенность</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${selectedRec.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{Math.round(selectedRec.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-5">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-5 h-5 mr-2" />
                <h4 className="text-lg font-semibold">Информация о демо-режиме</h4>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Используются демонстрационные данные OnkoAI</p>
                <p>• Все рекомендации сгенерированы ИИ</p>
                <p>• В продакшн-версии будут использоваться реальные модели ИИ</p>
                <p className="mt-2 text-xs text-gray-400">
                  Создано: {formatDate(selectedRec.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        {!selectedRec && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Рекомендации не найдены</h4>
            <p className="text-gray-500">Для этого пациента нет рекомендаций ИИ</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Рекомендации предоставлены ИИ и требуют проверки врачом
          </div>
          <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            ДЕМО-РЕЖИМ
          </div>
        </div>
      </div>
    </div>
  )
}
