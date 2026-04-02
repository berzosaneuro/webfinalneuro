import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const USER_COOKIE_NAME = 'bn_user_session'

const PUBLIC_API_PREFIXES = [
  '/api/auth/session',
  '/api/contact',
  '/api/leads',
  '/api/subscribers',
  '/api/ia-coach',
  '/api/stripe/webhook',
  '/api/biblioteca',
  '/api/leaderboard',
]

const USER_PROTECTED_API_PREFIXES = [
  '/api/diario',
  '/api/mapa',
  '/api/neuroscore',
  '/api/programa',
  '/api/test-results',
  '/api/stripe/create-checkout-session',
  '/api/stripe/billing-portal',
  '/api/stripe/payments',
  '/api/users/premium-status',
  '/api/elevenlabs',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const user = request.cookies.get(USER_COOKIE_NAME)?.value
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/acceder'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (!pathname.startsWith('/api/')) return NextResponse.next()

  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next()

  if (pathname === '/api/users' && request.method === 'POST') return NextResponse.next()

  if (pathname.startsWith('/api/admin/')) {
    const user = request.cookies.get(USER_COOKIE_NAME)?.value
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return NextResponse.next()
  }

  if (USER_PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    const user = request.cookies.get(USER_COOKIE_NAME)?.value
    if (!user) return NextResponse.json({ error: 'Sesión requerida' }, { status: 401 })
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
