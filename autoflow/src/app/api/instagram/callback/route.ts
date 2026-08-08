import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { exchangeCodeForToken, getLongLivedToken, getIgProfile } from '@/lib/instagram'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code  = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/settings?ig_error=1', process.env.NEXT_PUBLIC_APP_URL))
  }

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
  }

  try {
    const userId = (session.user as any).id

    // 1. Intercambiar código por token de corta duración
    const { access_token: shortToken } = await exchangeCodeForToken(code)

    // 2. Obtener token de larga duración (60 días)
    const { access_token: longToken, expires_in } = await getLongLivedToken(shortToken)

    // 3. Obtener perfil de Instagram
    const profile = await getIgProfile(longToken)

    // 4. Guardar o actualizar la cuenta en BD
    const expiresAt = new Date(Date.now() + expires_in * 1000)

    await prisma.instagramAccount.upsert({
      where: { igUserId: profile.id },
      create: {
        userId,
        igUserId:      profile.id,
        username:      profile.username,
        name:          profile.name,
        profilePicUrl: profile.profile_picture_url,
        accessToken:   longToken,
        tokenExpiresAt: expiresAt,
      },
      update: {
        accessToken:    longToken,
        tokenExpiresAt: expiresAt,
        isActive:       true,
        name:           profile.name,
        profilePicUrl:  profile.profile_picture_url,
      },
    })

    return NextResponse.redirect(new URL('/settings?ig_connected=1', process.env.NEXT_PUBLIC_APP_URL))
  } catch (err) {
    console.error('Instagram callback error:', err)
    return NextResponse.redirect(new URL('/settings?ig_error=1', process.env.NEXT_PUBLIC_APP_URL))
  }
}
