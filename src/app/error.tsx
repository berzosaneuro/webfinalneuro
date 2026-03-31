'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="glass rounded-3xl p-6 max-w-md text-center">
        <h1 className="font-heading text-xl font-bold text-white mb-2">Algo falló</h1>
        <p className="text-text-secondary text-sm mb-4">
          Ocurrió un error inesperado. Inténtalo de nuevo en unos segundos.
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-accent-blue text-white text-sm font-semibold"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
