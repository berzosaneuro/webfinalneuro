import { NextResponse } from 'next/server'

/**
 * Comprueba qué env ven las rutas API (no expone claves, solo presencia/URL pública).
 */
export async function GET() {
  return NextResponse.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
}
