'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export default function DataUpload() {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(sheet)
      
      // Преобразуем данные из Excel в нашу структуру
      for (const row of jsonData as any[]) {
        // Создаем пациента
        const { data: patient } = await supabase.from('patients').insert({
          identifier: row['Идентификационный номер'],
          full_name: row['Пациент'],
          gender: row['Пол'],
          age: row['Возраст на момент начала лечения'],
          diagnosis: row['Диагноз (текст)'],
          stage: row['Стадия']
        }).select().single()
        
        if (patient && row['РЭА до лечения']) {
          // Добавляем онкомаркеры
          await supabase.from('tumor_markers').insert([
            {
              patient_id: patient.id,
              marker_name: 'РЭА',
              value: parseFloat(row['РЭА до лечения'].toString().replace(',', '.')),
              date: new Date().toISOString().split('T')[0]
            },
            {
              patient_id: patient.id,
              marker_name: 'СА 19.9',
              value: parseFloat(row['СА 19.9 до лечения'].toString().replace(',', '.')),
              date: new Date().toISOString().split('T')[0]
            }
          ])
        }
      }
      
      setUploading(false)
      alert(`Загружено ${jsonData.length} пациентов`)
      window.location.reload()
    }
    
    reader.readAsBinaryString(file)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-2">Загрузка данных из Excel</h3>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-gray-500 mt-2">Загрузка...</p>}
    </div>
  )
}
