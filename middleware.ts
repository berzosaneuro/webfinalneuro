import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase/env'

// ---------------------------------------------------------------------------
// Rate-limit configuration (requests per minute per IP)
// ---------------------------------------------------------------------------
const SENSITIVE_LIMIT = 10
const NORMAL_LIMIT = 30

const SENSITIVE_PREFIXES = [
  '/api/auth/',
  '/api/admin/',
  '/api/contact',
  '/api/leads',
  '/api/ia-coach',
]

// Stripe webhook must never be rate-limited (Stripe retries on failure)
const RATE_LIMIT_EXEMPT = ['/api/stripe/webhook']

// ---------------------------------------------------------------------------
// Route classification
// ---------------------------------------------------------------------------
const PUBLIC_API_PREFIXES = [
  '/api/auth/',
  '/api/health/',
  '/api/stripe/webhook',
  '/api/biblioteca',
  '/api/leaderboard',
  '/api/audio-config',
  '/api/fcm-sw-config',
  '/api/debug/',
]

const PUBLIC_POST_ONLY = [
  '/api/contact',
  '/api/leads',
  '/api/subscribers',
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
  '/api/ia-coach',
  '/api/community',
]

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.ip ||
    'unknown'
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // `env.ts` hace fail-fast si faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY

  // --- Rate limiting (before auth to block floods early) ---
  if (
    pathname.startsWith('/api/') &&
    !RATE_LIMIT_EXEMPT.some((p) => pathname.startsWith(p))
  ) {
    const ip = getClientIp(request)
    // GET /api/auth/session: el cliente (UserContext) lo llama a menudo; no usar límite estricto.
    const isAuthSessionGet =
      request.method === 'GET' && pathname === '/api/auth/session'
    const isSensitive =
      SENSITIVE_PREFIXES.some((p) => pathname.startsWith(p)) && !isAuthSessionGet
    const limit = isSensitive ? SENSITIVE_LIMIT : NORMAL_LIMIT
    const bucket = isSensitive ? `s:${ip}` : `n:${ip}`
    const { limited, remaining } = rateLimit(bucket, limit)

    if (limited) {
      return NextResponse.json(
        { error: 'Too many requests, try again later' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
          },
        },
      )
    }

    // Attach rate-limit headers to eventual response (set after Supabase cookie handling)
    request.headers.set('x-rl-limit', String(limit))
    request.headers.set('x-rl-remaining', String(remaining))
  }

  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  // --- Admin pages: autenticado + rol admin o master (public.users) ---
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/acceder'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    const email = user.email?.trim().toLowerCase()
    if (!email) {
      const u = request.nextUrl.clone()
      u.pathname = '/acceder'
      u.searchParams.set('next', pathname)
      return NextResponse.redirect(u)
    }
    const serviceRole = getSupabaseServiceRole()
    if (!serviceRole) {
      console.error('[middleware] getSupabaseServiceRole null (SUPABASE_SERVICE_ROLE_KEY o URL)')
      const deny = request.nextUrl.clone()
      deny.pathname = '/'
      deny.searchParams.set('error', 'config')
      return NextResponse.redirect(deny)
    }
    const { data: row, error: roleErr } = await serviceRole
      .from('users')
      .select('role')
      .ilike('email', email)
      .maybeSingle()
    if (roleErr) {
      console.error('[middleware] users.role', roleErr.message)
      const deny = request.nextUrl.clone()
      deny.pathname = '/'
      deny.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(deny)
    }
    const r = row?.role
    if (r !== 'admin' && r !== 'master') {
      const deny = request.nextUrl.clone()
      deny.pathname = '/'
      deny.searchParams.set('error', 'no_admin')
      return NextResponse.redirect(deny)
    }
  }

  // --- API routes ---
  if (pathname.startsWith('/api/')) {
    if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
      return supabaseResponse
    }

    if (PUBLIC_POST_ONLY.some((p) => pathname.startsWith(p))) {
      if (request.method === 'POST') {
        return supabaseResponse
      }
      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
      return supabaseResponse
    }

    if (pathname === '/api/users' && request.method === 'POST') {
      return supabaseResponse
    }

    if (pathname.startsWith('/api/admin/')) {
      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
      return supabaseResponse
    }

    if (USER_PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
      if (!user) {
        return NextResponse.json({ error: 'Sesión requerida' }, { status: 401 })
      }
      return supabaseResponse
    }

    if (pathname.startsWith('/api/')) {
      if (!user) {
        return NextResponse.json({ error: 'Sesión requerida' }, { status: 401 })
      }
      return supabaseResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/debug', '/debug/:path*'],
}
