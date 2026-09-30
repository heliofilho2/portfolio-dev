import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import Markdown from '@/components/Markdown'
import MediaImg from '@/components/MediaImg'
import NewsletterForm from '@/components/NewsletterForm'
import { fmtDate, getPost, getPosts } from '@/lib/content'

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return { title: 'Post não encontrado | helio*filho*.dev' }
  return {
    title: `${post.title} | helio*filho*.dev`,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: 'article', url: `https://heliofilho.dev/blog/${post.slug}`, images: [post.cover_url ?? '/helio.jpg'] },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, all] = await Promise.all([getPost(slug), getPosts()])
  if (!post) notFound()
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3)
  const minutes = Math.max(1, Math.round(post.body_md.split(/\s+/).length / 200))

  return (
    <>
      <PageReveal />
      <Header active="/blog" />
      <main className="wrap max-w-[800px] py-8 sm:py-10 pb-16">
        <Link href="/blog" className="font-mono text-xs tracking-[0.1em] uppercase text-subtle hover:text-ink">
          ← Blog
        </Link>

        <header data-reveal className="mt-6">
          <div className="label text-accent">
            {fmtDate(post.published_at)} · {minutes} min de leitura
          </div>
          <h1 className="font-serif text-[clamp(38px,5.5vw,62px)] leading-[.98] tracking-[-0.025em] mt-2.5 mb-3.5">{post.title}</h1>
          {post.summary && <p className="text-[17px] sm:text-lg leading-[1.55] text-muted">{post.summary}</p>}
          {post.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-4">
              {post.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-chip text-[12.5px] text-muted">
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.cover_url && (
          <div data-reveal className="relative aspect-[16/9] rounded-[22px] overflow-hidden mt-7 bg-chip">
            <MediaImg src={post.cover_url} alt="" fill priority sizes="(min-width: 800px) 760px, 100vw" className="object-cover" />
          </div>
        )}

        <article data-reveal className="mt-8">
          <Markdown className="sm:text-[17px]">{post.body_md}</Markdown>
        </article>

        <div data-reveal className="mt-12 bg-butter rounded-[24px] p-5 sm:p-7 flex flex-col gap-3">
          <span className="font-serif text-[clamp(24px,3vw,30px)] leading-[1.1]">Gostou? Toda sexta tem mais na newsletter.</span>
          <NewsletterForm variant="block" ctaLabel="Assinar" />
        </div>

        {more.length > 0 && (
          <section className="mt-12">
            <h2 className="h-sub mb-3">Mais do blog</h2>
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="flex justify-between gap-4 py-3.5 border-t border-line text-ink hover:text-accent">
                <span className="font-medium">{p.title}</span>
                <span className="font-mono text-[11.5px] text-subtle shrink-0 pt-1">{fmtDate(p.published_at)}</span>
              </Link>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
