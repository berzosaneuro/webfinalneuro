import type { MetadataRoute } from 'next'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalAppBaseUrl() ?? 'https://berzosaneuro.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/debug'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
