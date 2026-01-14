import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'OnkoAI Demo - Система поддержки решений в онкологии',
  description: 'Демонстрационная версия системы искусственного интеллекта для поддержки принятия решений в онкологии',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
