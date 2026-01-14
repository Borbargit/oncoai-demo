'use client'

import { useState } from 'react'
import { Search, User, Calendar, Stethoscope } from 'lucide-react'

interface Patient {
  id: string
  name: string
  age: number
  diagnosis: string
  lastVisit: string
  status: 'active' | 'recovering' | 'critical'
}

const mockPatients: Patient[] = [
  { id: '1', name: 'Иванов Иван', age: 45, diagnosis: 'Рак легких', lastVisit: '2024-01-15', status: 'active' },
  { id: '2', name: 'Петрова Анна', age: 52, diagnosis: 'Рак молочной железы', lastVisit: '2024-01-10', status: 'recovering' },
  { id: '3', name: 'Сидоров Петр', age: 38, diagnosis: 'Меланома', lastVisit: '2024-01-05', status: 'critical' },
  { id: '4', name: 'Кузнецова Мария', age: 61, diagnosis: 'Колоректальный рак', lastVisit: '2024-01-12', status: 'active' },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  recovering: 'bg-blue-100 text-blue-800',
  critical: 'bg-red-100 text-red-800',
}

export default function PatientList() {
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState<Patient[]>(mockPatients)

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Список пациентов</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск пациентов..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Пациент</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Возраст</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Диагноз</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Последний визит</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Статус</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-gray-600">
                    <span>{patient.age} лет</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <Stethoscope className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium">{patient.diagnosis}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{patient.lastVisit}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[patient.status]}`}>
                    {patient.status === 'active' && 'Активный'}
                    {patient.status === 'recovering' && 'Восстановление'}
                    {patient.status === 'critical' && 'Критический'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Подробнее →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Пациенты не найдены</p>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-gray-600">Всего пациентов: {patients.length}</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
          Добавить пациента
        </button>
      </div>
    </div>
  )
}
