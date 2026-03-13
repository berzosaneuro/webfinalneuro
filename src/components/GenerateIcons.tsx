'use client'

/**
 * This component generates PWA icons as canvas-drawn PNGs.
 * Visit /generate-icons to create the icon files.
 * In production, use pre-built PNG files instead.
 */
export default function GenerateIcons() {
  const generate = (size: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    ctx.fillStyle = '#080B16'
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, size * 0.2)
    ctx.fill()

    // Brain icon circle
    const cx = size / 2
    const cy = size * 0.42
    const r = size * 0.22
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = '#7C3AED'
    ctx.globalAlpha = 0.2
    ctx.fill()
    ctx.globalAlpha = 1

    // Brain outline
    ctx.strokeStyle = '#7C3AED'
    ctx.lineWidth = size * 0.02
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()

    // N letter
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${size * 0.28}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('N', cx, cy)

    // Text
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 ${size * 0.08}px sans-serif`
    ctx.fillText('NEURO', cx, size * 0.75)
    ctx.font = `300 ${size * 0.055}px sans-serif`
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('PRESENCIA', cx, size * 0.84)

    // Download
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `icon-${size}.png`
    a.click()
  }

  return (
    <div className="p-8 flex flex-col gap-4 items-start">
      <h1 className="text-xl font-bold text-white">Generar iconos PWA</h1>
      <button onClick={() => generate(192)} className="px-4 py-2 bg-accent-blue text-white rounded">
        Descargar 192x192
      </button>
      <button onClick={() => generate(512)} className="px-4 py-2 bg-accent-blue text-white rounded">
        Descargar 512x512
      </button>
    </div>
  )
}
