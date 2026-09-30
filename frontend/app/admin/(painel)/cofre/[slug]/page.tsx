import { notFound } from 'next/navigation'
import CofreEditor from '@/components/admin/CofreEditor'
import LoadError from '@/components/admin/LoadError'
import { blankCofre } from '@/lib/adminBlank'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function EditCofre({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />
  const topics = [...new Set(data.cofre.map((c) => c.topic).filter((t): t is string => !!t))]
  if (slug === 'novo') return <CofreEditor item={blankCofre()} isNew topics={topics} />
  const item = data.cofre.find((c) => c.slug === slug)
  if (!item) notFound()
  return <CofreEditor key={item.slug} item={item} isNew={false} topics={topics} />
}
