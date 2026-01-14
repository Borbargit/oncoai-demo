'use client'

import { useState } from 'react'
import { Brain, MessageSquare, Upload, Download, Sparkles } from 'lucide-react'

export default function AIPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ text: string; isAI: boolean }>>([
    { text: 'Здравствуйте! Я OnkoAI, ваш помощник в онкологии. Какой случай вы хотели бы обсудить?', isAI: true },
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { text: userMessage, isAI: false }])
    setInput('')
    setIsAnalyzing(true)

    // Имитация ответа AI
    setTimeout(() => {
      const responses = [
        'На основе предоставленных данных, рекомендую рассмотреть иммунотерапию в сочетании с химиотерапией.',
        'Для данного типа опухоли эффективность таргетной терапии составляет 68% по данным последних исследований.',
        'Рекомендую провести дополнительные генетические тесты для определения оптимального протокола лечения.',
        'У пациента наблюдаются положительные изменения, но требуется корректировка дозировки препаратов.',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { text: randomResponse, isAI: true }])
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMessages(prev => [...prev, { 
        text: `Загружен файл: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 
        isAI: false 
      }])
      // Имитация анализа файла
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: 'Файл успешно проанализирован. Обнаружены признаки, требующие внимания.', 
          isAI: true 
        }])
      }, 2000)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">OnkoAI Ассистент</h2>
            <p className="text-gray-600">ИИ-помощник для анализа случаев</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload className="w-4 h-4 mr-2" />
            Загрузить снимки
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.dcm,.pdf"
              onChange={handleFileUpload}
            />
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Экспорт отчета
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-inner p-4 h-64 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${msg.isAI ? 'text-left' : 'text-right'}`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                  msg.isAI
                    ? 'bg-blue-100 text-gray-800'
                    : 'bg-purple-600 text-white'
                }`}
              >
                <div className="flex items-center">
                  {msg.isAI && <Sparkles className="w-4 h-4 mr-2" />}
                  {msg.text}
                </div>
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${msg.isAI ? 'text-left' : 'text-right'}`}>
                {msg.isAI ? 'OnkoAI' : 'Вы'}
              </div>
            </div>
          ))}
          {isAnalyzing && (
            <div className="text-left">
              <div className="inline-block px-4 py-2 rounded-lg bg-blue-100">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  <span>Анализирую...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Опишите случай или задайте вопрос..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Отправить
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Быстрые вопросы</h4>
          <div className="space-y-2">
            {['Анализ КТ снимков', 'Рекомендации по лечению', 'Прогноз выживаемости'].map((question) => (
              <button
                key={question}
                onClick={() => setInput(question)}
                className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Статистика</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Точность диагноза</span>
              <span className="font-semibold">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Анализировано случаев</span>
              <span className="font-semibold">1,247</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Совет дня</h4>
          <p className="text-sm text-gray-600">
            При анализе меланомы обращайте внимание на асимметрию, границы, цвет и диаметр (правило ABCD).
          </p>
        </div>
      </div>
    </div>
  )
}
