import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/maintenance', '/admin', '/api'] },
    sitemap: 'https://heliofilho.dev/sitemap.xml',
  }
}
