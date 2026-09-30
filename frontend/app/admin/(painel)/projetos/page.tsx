import AdminList from '@/components/admin/AdminList'
import LoadError from '@/components/admin/LoadError'
import { initialOf } from '@/lib/contentModel'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function AdminProjetos() {
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />
  return (
    <AdminList
      title="Projetos"
      newHref="/admin/projetos/novo"
      newLabel="Novo projeto"
      empty="Nenhum projeto ainda."
      rows={data.projects.map((p) => ({
        key: p.slug,
        href: `/admin/projetos/${p.slug}`,
        title: p.name,
        meta: [`#${p.sort}`, p.status, p.type, `${data.updates.filter((u) => u.project_slug === p.slug).length} no diário`].join(' · '),
        published: p.published !== false,
        initial: initialOf(p.name),
        tone: p.tone,
        thumb: p.cover_url,
      }))}
    />
  )
}
