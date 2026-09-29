import type { MetadataRoute } from 'next'
import { projectsApi } from '@/lib/api'

const baseUrl = 'https://heliofilho.dev'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await projectsApi.getAll()) ?? []

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
