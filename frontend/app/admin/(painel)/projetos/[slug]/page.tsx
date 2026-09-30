import { notFound } from 'next/navigation'
import LoadError from '@/components/admin/LoadError'
import ProjectEditor from '@/components/admin/ProjectEditor'
import { blankProject } from '@/lib/adminBlank'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />
  if (slug === 'novo') return <ProjectEditor project={blankProject(Math.max(0, ...data.projects.map((p) => p.sort)) + 1)} isNew updates={[]} />
  const project = data.projects.find((p) => p.slug === slug)
  if (!project) notFound()
  const updates = data.updates.filter((u) => u.project_slug === slug).sort((a, b) => b.published_at.localeCompare(a.published_at))
  return <ProjectEditor key={project.slug} project={project} isNew={false} updates={updates} />
}
