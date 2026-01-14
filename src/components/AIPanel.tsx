'use client'

import { useState } from 'react'
import { Brain, MessageSquare, Sparkles } from 'lucide-react'

export default function AIPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ text: string; isAI: boolean }>>([
    { text: 'Здравствуйте! Я OnkoAI, ваш помощник в онкологии. Какой случай вы хотели бы обсудить?', isAI: true },
  ])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { text: userMessage, isAI: false }])
    setInput('')

    // Имитация ответа AI
    setTimeout(() => {
      const responses = [
        'На основе предоставленных данных рекомендую рассмотреть иммунотерапию.',
        'Для данного типа опухоли эффективность составляет 68% по данным исследований.',
        'Рекомендую провести дополнительные генетические тесты.',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { text: randomResponse, isAI: true }])
    }, 1000)
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-4">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">OnkoAI Ассистент</h2>
          <p className="text-gray-600">ИИ-помощник для анализа случаев</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-inner p-4 h-48 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${msg.isAI ? 'text-left' : 'text-right'}`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
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
            </div>
          ))}
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
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Отправить
        </button>
      </div>
    </div>
  )
}
