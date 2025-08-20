import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Temporarily disable authentication for testing - all routes are public
  // This allows you to visit any page directly without login
  
  // Uncomment below code to re-enable authentication later:
  /*
  const token = request.cookies.get('token')?.value
  const publicRoutes = ['/', '/login', '/register', '/quality-check', '/quality-check-pending', '/quality-check-failed', '/bank-details']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    const payload = verifyToken(token)
    if (!payload && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  */

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}