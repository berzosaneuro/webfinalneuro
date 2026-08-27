import type { MetadataRoute } from 'next'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'
import { posts } from '@/data/posts'

/** Rutas públicas, indexables, sin gate de sesión. */
const STATIC_ROUTES = [
  '',
  '/metodo',
  '/sobre',
  '/planes',
  '/plan-7-dias',
  '/biblioteca',
  '/test',
  '/libro',
  '/retiro',
  '/corporativo',
  '/certificacion',
  '/historias',
  '/contacto',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getCanonicalAppBaseUrl() ?? 'https://berzosaneuro.com'

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  const biblioteca: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/biblioteca/${p.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...biblioteca]
}
