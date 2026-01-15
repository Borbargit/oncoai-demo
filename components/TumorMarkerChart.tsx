'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Демо-данные онкомаркеров
const DEMO_TUMOR_MARKERS = [
  { patient_id: '1', date: '2023-11-01', cea: 5.2, ca19_9: 35, psa: null, ca125: null },
  { patient_id: '1', date: '2023-11-15', cea: 6.8, ca19_9: 42, psa: null, ca125: null },
  { patient_id: '1', date: '2023-12-01', cea: 8.1, ca19_9: 55, psa: null, ca125: null },
  { patient_id: '1', date: '2023-12-15', cea: 6.2, ca19_9: 38, psa: null, ca125: null },
  { patient_id: '1', date: '2024-01-01', cea: 5.8, ca19_9: 32, psa: null, ca125: null },
  { patient_id: '1', date: '2024-01-15', cea: 4.9, ca19_9: 28, psa: null, ca125: null },
  
  { patient_id: '2', date: '2023-11-01', cea: null, ca19_9: null, psa: null, ca125: 45 },
  { patient_id: '2', date: '2023-11-15', cea: null, ca19_9: null, psa: null, ca125: 38 },
  { patient_id: '2', date: '2023-12-01', cea: null, ca19_9: null, psa: null, ca125: 32 },
  { patient_id: '2', date: '2023-12-15', cea: null, ca19_9: null, psa: null, ca125: 28 },
  { patient_id: '2', date: '2024-01-01', cea: null, ca19_9: null, psa: null, ca125: 25 },
  { patient_id: '2', date: '2024-01-15', cea: null, ca19_9: null, psa: null, ca125: 22 },
]

interface TumorMarkerChartProps {
  patientId: string
}

export default function TumorMarkerChart({ patientId }: TumorMarkerChartProps) {
  const [markers, setMarkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>(['cea', 'ca19_9', 'ca125'])

  useEffect(() => {
    async function fetchMarkers() {
      setLoading(true)
      
      try {
        // Используем демо-данные
        const patientMarkers = DEMO_TUMOR_MARKERS.filter(marker => marker.patient_id === patientId)
        
        // Форматируем данные для графика
        const formattedData = patientMarkers.map(marker => ({
          date: new Date(marker.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
          fullDate: marker.date,
          cea: marker.cea,
          ca19_9: marker.ca19_9,
          psa: marker.psa,
          ca125: marker.ca125
        }))
        
        setMarkers(formattedData)
        
      } catch (error) {
        console.error('Error loading tumor markers:', error)
        
        // Fallback данные
        const fallbackData = [
          { date: '1 ноя', cea: 5.2, ca19_9: 35, ca125: 45 },
          { date: '15 ноя', cea: 6.8, ca19_9: 42, ca125: 38 },
          { date: '1 дек', cea: 8.1, ca19_9: 55, ca125: 32 },
          { date: '15 дек', cea: 6.2, ca19_9: 38, ca125: 28 },
          { date: '1 янв', cea: 5.8, ca19_9: 32, ca125: 25 },
          { date: '15 янв', cea: 4.9, ca19_9: 28, ca125: 22 },
        ]
        setMarkers(fallbackData)
        
      } finally {
        setLoading(false)
      }
    }

    fetchMarkers()
  }, [patientId])

  const getTrend = (markerData: any[]) => {
    if (markerData.length < 2) return 'stable'
    
    const first = markerData[0]
    const last = markerData[markerData.length - 1]
    
    // Находим последнее ненулевое значение для каждого маркера
    const markersToCheck = ['cea', 'ca19_9', 'ca125', 'psa']
    
    for (const marker of markersToCheck) {
      const firstValue = first[marker]
      const lastValue = last[marker]
      
      if (firstValue && lastValue) {
        const change = ((lastValue - firstValue) / firstValue) * 100
        
        if (change > 10) return 'up'
        if (change < -10) return 'down'
        return 'stable'
      }
    }
    
    return 'stable'
  }

  const trend = getTrend(markers)
  const trendIcon = {
    up: <TrendingUp className="w-5 h-5 text-red-600" />,
    down: <TrendingDown className="w-5 h-5 text-green-600" />,
    stable: <Minus className="w-5 h-5 text-yellow-600" />
  }[trend]

  const trendText = {
    up: 'Рост показателей',
    down: 'Снижение показателей', 
    stable: 'Стабильные показатели'
  }[trend]

  const markerConfigs = {
    cea: { name: 'РЭА (CEA)', color: '#3b82f6', normalRange: '0-5 нг/мл' },
    ca19_9: { name: 'CA 19-9', color: '#10b981', normalRange: '0-37 Ед/мл' },
    ca125: { name: 'CA 125', color: '#8b5cf6', normalRange: '0-35 Ед/мл' },
    psa: { name: 'ПСА (PSA)', color: '#f59e0b', normalRange: '0-4 нг/мл' }
  }

  const toggleMarker = (marker: string) => {
    setSelectedMarkers(prev => 
      prev.includes(marker) 
        ? prev.filter(m => m !== marker)
        : [...prev, marker]
    )
  }

  // Функция для форматирования значений в тултипе
  const formatTooltipValue = (value: number | undefined) => {
    if (value === null || value === undefined) return '—'
    return value.toFixed(2)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Загрузка онкомаркеров...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Activity className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Динамика онкомаркеров</h3>
            </div>
            <p className="text-gray-600">Изменение показателей за последние 3 месяца</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {trendIcon}
            <div>
              <div className="font-semibold text-gray-900">{trendText}</div>
              <div className="text-sm text-gray-500">Общая тенденция</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marker Selector */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {Object.entries(markerConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => toggleMarker(key)}
              className={`px-4 py-2 rounded-lg flex items-center transition ${
                selectedMarkers.includes(key)
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: config.color }}
              ></div>
              {config.name}
              <span className="ml-2 text-xs opacity-75">{config.normalRange}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-80">
          {markers.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={markers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  label={{ 
                    value: 'Концентрация', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -10,
                    style: { textAnchor: 'middle', fontSize: 12 }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '0.75rem'
                  }}
                  formatter={(value: any) => [
                    formatTooltipValue(value),
                    'Значение'
                  ]}
                  labelFormatter={(label) => `Дата: ${label}`}
                />
                <Legend />
                
                {selectedMarkers.includes('cea') && (
                  <Line
                    type="monotone"
                    dataKey="cea"
                    name="РЭА (CEA)"
                    stroke={markerConfigs.cea.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                
                {selectedMarkers.includes('ca19_9') && (
                  <Line
                    type="monotone"
                    dataKey="ca19_9"
                    name="CA 19-9"
                    stroke={markerConfigs.ca19_9.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                
                {selectedMarkers.includes('ca125') && (
                  <Line
                    type="monotone"
                    dataKey="ca125"
                    name="CA 125"
                    stroke={markerConfigs.ca125.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                
                {selectedMarkers.includes('psa') && (
                  <Line
                    type="monotone"
                    dataKey="psa"
                    name="ПСА (PSA)"
                    stroke={markerConfigs.psa.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Нет данных</h4>
                <p className="text-gray-500">Для этого пациента нет данных об онкомаркерах</p>
              </div>
            </div>
          )}
        </div>

        {/* Latest Values */}
        {markers.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Последние значения</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(markerConfigs).map(([key, config]) => {
                const latestValue = markers[markers.length - 1]?.[key]
                if (latestValue === null || latestValue === undefined) return null
                
                const isNormal = key === 'cea' ? latestValue <= 5 :
                                key === 'ca19_9' ? latestValue <= 37 :
                                key === 'ca125' ? latestValue <= 35 :
                                key === 'psa' ? latestValue <= 4 : true
                
                return (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{config.name}</span>
                      <div className={`w-2 h-2 rounded-full ${isNormal ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{latestValue.toFixed(1)}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {isNormal ? 'В норме' : 'Выше нормы'}
                      <span className="block text-xs">{config.normalRange}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Данные обновлены: {new Date().toLocaleDateString('ru-RU')}
          </div>
          <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            ДЕМО-ДАННЫЕ
          </div>
        </div>
      </div>
    </div>
  )
}
