/**
 * Instagram Graph API — helpers para OAuth y mensajería
 *
 * Meta docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
 */

const BASE = 'https://graph.instagram.com'
const OAUTH_BASE = 'https://api.instagram.com/oauth'

export function getOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id:     process.env.INSTAGRAM_APP_ID!,
    redirect_uri:  `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`,
    scope:         'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments',
    response_type: 'code',
    state,
  })
  return `${OAUTH_BASE}/authorize?${params}`
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  user_id: string
}> {
  const params = new URLSearchParams({
    client_id:     process.env.INSTAGRAM_APP_ID!,
    client_secret: process.env.INSTAGRAM_APP_SECRET!,
    grant_type:    'authorization_code',
    redirect_uri:  `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`,
    code,
  })

  const res = await fetch(`${OAUTH_BASE}/access_token`, {
    method: 'POST',
    body:   params,
  })
  if (!res.ok) throw new Error(`OAuth error: ${await res.text()}`)
  return res.json()
}

export async function getLongLivedToken(shortToken: string): Promise<{
  access_token: string
  token_type: string
  expires_in: number
}> {
  const url = new URL(`${BASE}/access_token`)
  url.searchParams.set('grant_type', 'ig_exchange_token')
  url.searchParams.set('client_secret', process.env.INSTAGRAM_APP_SECRET!)
  url.searchParams.set('access_token', shortToken)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Token exchange error: ${await res.text()}`)
  return res.json()
}

export async function getIgProfile(accessToken: string): Promise<{
  id: string
  username: string
  name: string
  profile_picture_url: string
}> {
  const url = new URL(`${BASE}/me`)
  url.searchParams.set('fields', 'id,username,name,profile_picture_url')
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Profile fetch error: ${await res.text()}`)
  return res.json()
}

export async function sendIgDM(params: {
  recipientId: string
  message: string
  accessToken: string
  igUserId: string
}): Promise<void> {
  const res = await fetch(`${BASE}/v21.0/${params.igUserId}/messages`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient:    { id: params.recipientId },
      message:      { text: params.message },
      access_token: params.accessToken,
    }),
  })
  if (!res.ok) throw new Error(`DM send error: ${await res.text()}`)
}

export async function sendCommentReply(params: {
  commentId: string
  message: string
  accessToken: string
}): Promise<void> {
  const res = await fetch(`${BASE}/v21.0/${params.commentId}/replies`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message:      params.message,
      access_token: params.accessToken,
    }),
  })
  if (!res.ok) throw new Error(`Comment reply error: ${await res.text()}`)
}
