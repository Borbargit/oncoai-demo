'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('doctor')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // В демо используем простую аутентификацию
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (!error) {
      // Редирект в зависимости от роли
      if (role === 'doctor') window.location.href = '/doctor'
      else if (role === 'patient') window.location.href = '/patient'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">ОнкоИИ Ассистент</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Роль</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2"
            >
              <option value="doctor">Врач</option>
              <option value="patient">Пациент</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2"
              placeholder="doctor@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Войти
          </button>
        </form>
        
        <div className="text-sm text-gray-500">
          <p>Демо доступы:</p>
          <p>Врач: doctor@demo.ru / doctor123</p>
          <p>Пациент: patient@demo.ru / patient123</p>
        </div>
      </div>
    </div>
  )
}
