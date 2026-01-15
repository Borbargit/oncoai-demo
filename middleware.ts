import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Защищенные маршруты и требуемые роли
const protectedRoutes: Record<string, string[]> = {
  '/doctor': ['doctor'],
  '/patient': ['patient'],
  '/admin': ['admin'],
  '/dashboard': ['doctor', 'admin'] // dashboard доступен врачам и админам
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Проверяем, является ли маршрут защищенным
  const route = Object.keys(protectedRoutes).find(route => 
    path.startsWith(route)
  )
  
  if (route) {
    // Получаем роль из localStorage через cookies (в middleware мы не можем использовать localStorage)
    const userRole = request.cookies.get('user-role')?.value
    
    if (!userRole) {
      // Если нет роли, редирект на логин
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Проверяем, есть ли у пользователя нужная роль
    const allowedRoles = protectedRoutes[route]
    if (!allowedRoles.includes(userRole)) {
      // Если роль не подходит, редирект на соответствующую страницу или логин
      switch(userRole) {
        case 'doctor':
          return NextResponse.redirect(new URL('/doctor', request.url))
        case 'patient':
          return NextResponse.redirect(new URL('/patient', request.url))
        case 'admin':
          return NextResponse.redirect(new URL('/admin', request.url))
        default:
          return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

// Конфигурация middleware
export const config = {
  matcher: [
    '/doctor/:path*',
    '/patient/:path*', 
    '/admin/:path*',
    '/dashboard/:path*'
  ]
}
