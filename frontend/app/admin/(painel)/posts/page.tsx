import AdminList from '@/components/admin/AdminList'
import LoadError from '@/components/admin/LoadError'
import { fmtDate, initialOf } from '@/lib/contentModel'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function AdminPosts() {
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />
  return (
    <AdminList
      title="Blog"
      newHref="/admin/posts/novo"
      newLabel="Novo post"
      empty="Nenhum post ainda. Que tal o primeiro?"
      rows={data.posts.map((p) => ({
        key: p.slug,
        href: `/admin/posts/${p.slug}`,
        title: p.title,
        meta: `${fmtDate(p.published_at)}${p.tags.length ? ` · ${p.tags.join(', ')}` : ''}`,
        published: p.published,
        initial: initialOf(p.title),
        tone: 'lilac',
        thumb: p.cover_url,
      }))}
    />
  )
}
