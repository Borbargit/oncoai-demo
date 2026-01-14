'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import PatientList from '@/components/PatientList'
import AIPanel from '@/components/AIPanel'

interface Patient {
  id: string
  identifier: string
  full_name: string
  diagnosis: string
  stage: string
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .limit(10)
    
    if (data) setPatients(data)
  }

  const runAIAnalysis = async (module: string) => {
    if (!selectedPatient) return
    
    // Имитация вызова ИИ
    const mockResponses: Record<string, string> = {
      diagnosis: `Диагноз: ${selectedPatient.diagnosis}. Стадия: ${selectedPatient.stage}. Рекомендуется подтверждение гистологией.`,
      prognosis: '5-летняя выживаемость: 85%. Риск рецидива: 15%.',
      treatment: 'Рекомендована схема химиотерапии AC-T. Ожидаемый ответ >70%.',
      monitoring: 'План наблюдения: КТ каждые 6 месяцев, онкомаркеры ежемесячно.'
    }
    
    await supabase.from('ai_recommendations').insert({
      patient_id: selectedPatient.id,
      module,
      recommendation: mockResponses[module],
      confidence: 0.85
    })
    
    alert(`ИИ-анализ завершен (${module})`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Панель врача</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Список пациентов */}
          <div className="lg:col-span-1">
            <PatientList 
              patients={patients} 
              onSelect={setSelectedPatient}
            />
          </div>
          
          {/* Детали пациента и ИИ */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {selectedPatient.full_name} ({selectedPatient.identifier})
                  </h2>
                  <p>Диагноз: {selectedPatient.diagnosis}</p>
                  <p>Стадия: {selectedPatient.stage}</p>
                </div>
                
                <AIPanel 
                  onAnalyze={runAIAnalysis}
                  patientId={selectedPatient.id}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p>Выберите пациента для анализа</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
