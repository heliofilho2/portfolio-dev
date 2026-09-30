import type { MetadataRoute } from 'next'
import { getCofreItems, getProjects } from '@/lib/content'

const baseUrl = 'https://heliofilho.dev'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, cofre] = await Promise.all([getProjects(), getCofreItems()])

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/sobre`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projetos`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/cofre`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/newsletter`, changeFrequency: 'monthly', priority: 0.6 },
    ...projects.map((p) => ({ url: `${baseUrl}/projetos/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...cofre.map((c) => ({ url: `${baseUrl}/cofre/${c.slug}`, lastModified: c.published_at, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
