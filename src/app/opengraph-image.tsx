import { ImageResponse } from 'next/og'

// Tarjeta de previsualización que sale al pegar cualquier enlace de
// berzosaneuro.com en WhatsApp, Facebook, Twitter, Telegram, LinkedIn…
export const runtime = 'edge'
export const alt = 'Berzosa Neuro — Método N.E.U.R.O.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function poppins(weight: 400 | 700) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Poppins:wght@${weight}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
    ).text()
    const url = css.match(/src: url\((https:[^)]+\.(?:woff2|ttf))\)/)?.[1]
    if (!url) return null
    return await (await fetch(url)).arrayBuffer()
  } catch {
    return null
  }
}

export default async function Image() {
  const [bold, regular] = await Promise.all([poppins(700), poppins(400)])
  const fonts = [
    ...(bold ? [{ name: 'Poppins', data: bold, weight: 700 as const, style: 'normal' as const }] : []),
    ...(regular ? [{ name: 'Poppins', data: regular, weight: 400 as const, style: 'normal' as const }] : []),
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          fontFamily: fonts.length ? 'Poppins, sans-serif' : 'sans-serif',
          background: 'linear-gradient(135deg, #3B1D7A 0%, #1A0E3A 50%, #0A0616 100%)',
          color: '#F3EEFF',
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#C9A9FF',
            fontWeight: 400,
          }}
        >
          @berzosa.neuro
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
          }}
        >
          Método N.E.U.R.O.
        </div>
        <div style={{ marginTop: 28, fontSize: 38, fontWeight: 400, color: '#C7BCE0', maxWidth: 900 }}>
          Menos ruido mental, más claridad cada día.
        </div>
        <div
          style={{
            marginTop: 44,
            alignSelf: 'flex-start',
            display: 'flex',
            padding: '16px 34px',
            borderRadius: 999,
            fontSize: 28,
            fontWeight: 700,
            background: 'linear-gradient(90deg,#A855F7,#EC4899)',
            color: '#fff',
          }}
        >
          berzosaneuro.com
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
