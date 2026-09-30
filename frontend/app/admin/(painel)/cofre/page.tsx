import AdminList from '@/components/admin/AdminList'
import LoadError from '@/components/admin/LoadError'
import { fmtDate, initialOf } from '@/lib/contentModel'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function AdminCofre() {
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />
  return (
    <AdminList
      title="Cofre"
      newHref="/admin/cofre/novo"
      newLabel="Nova página"
      empty="Nenhuma página no cofre ainda."
      rows={data.cofre.map((c) => ({
        key: c.slug,
        href: `/admin/cofre/${c.slug}`,
        title: c.title,
        meta: [c.category, c.topic, c.keyword && `DM: ${c.keyword}`, fmtDate(c.published_at)].filter(Boolean).join(' · '),
        published: c.published !== false,
        initial: initialOf(c.title),
        tone: c.tone,
        thumb: c.cover_url,
      }))}
    />
  )
}
