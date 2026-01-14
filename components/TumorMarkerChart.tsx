'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface TumorMarkerChartProps {
  patientId: string
}

export default function TumorMarkerChart({ patientId }: TumorMarkerChartProps) {
  const [markers, setMarkers] = useState<any[]>([])

  useEffect(() => {
    fetchMarkers()
  }, [patientId])

  const fetchMarkers = async () => {
    const { data } = await supabase
      .from('tumor_markers')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: true })
    
    if (data) {
      // Группируем по дате для графика
      const grouped = data.reduce((acc, curr) => {
        const date = curr.date
        if (!acc[date]) acc[date] = { date }
        acc[date][curr.marker_name] = curr.value
        return acc
      }, {})
      
      setMarkers(Object.values(grouped))
    }
  }

  if (markers.length === 0) {
    return <div className="text-center py-4 text-gray-500">Нет данных онкомаркеров</div>
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-4">Динамика онкомаркеров</h3>
      <div className="h-64">
        <LineChart width={500} height={250} data={markers}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="РЭА" stroke="#8884d8" />
          <Line type="monotone" dataKey="СА 19.9" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  )
}
