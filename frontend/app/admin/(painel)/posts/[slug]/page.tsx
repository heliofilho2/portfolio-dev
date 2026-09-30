import { notFound } from 'next/navigation'
import LoadError from '@/components/admin/LoadError'
import PostEditor from '@/components/admin/PostEditor'
import { blankPost } from '@/lib/adminBlank'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug === 'novo') return <PostEditor post={blankPost()} isNew />
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />
  const post = data.posts.find((p) => p.slug === slug)
  if (!post) notFound()
  return <PostEditor key={post.slug} post={post} isNew={false} />
}
