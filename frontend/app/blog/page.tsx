import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import MediaImg from '@/components/MediaImg'
import { fmtDate, getPosts, type Post } from '@/lib/content'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog | helio*filho*.dev',
  description: 'Bastidores, relatórios dos projetos e o que ando aprendendo.',
}

function Cover({ post, sizes }: { post: Post; sizes: string }) {
  return post.cover_url ? (
    <MediaImg src={post.cover_url} alt="" fill sizes={sizes} className="object-cover" />
  ) : (
    <span className="absolute inset-0 bg-lilac" style={{ backgroundImage: 'radial-gradient(rgba(79,70,200,.22) 1.2px,transparent 1.4px)', backgroundSize: '8px 8px' }} />
  )
}

export default async function BlogPage() {
  const posts = await getPosts()
  const [first, ...rest] = posts

  return (
    <>
      <PageReveal />
      <Header active="/blog" />
      <main className="wrap py-10 sm:py-14 pb-16">
        <div data-reveal className="text-center max-w-[640px] mx-auto mb-9">
          <div className="label text-accent">Blog</div>
          <h1 className="font-serif text-[clamp(48px,7vw,84px)] leading-[.92] tracking-[-0.03em] mt-2.5 mb-4">
            Do <em className="text-accent">blog</em>
          </h1>
          <p className="text-base sm:text-[17px] text-muted leading-[1.55]">Bastidores, relatórios dos projetos e o que ando aprendendo.</p>
        </div>

        {!first && (
          <p data-reveal className="text-center text-subtle py-10">
            Primeiro post em breve.
          </p>
        )}

        {first && (
          <Link
            data-reveal
            href={`/blog/${first.slug}`}
            className="grid md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] bg-surface border border-line rounded-[24px] overflow-hidden text-ink hover:text-ink transition-[box-shadow] duration-300 hover:shadow-[0_20px_40px_-28px_rgba(30,28,25,.45)]"
          >
            <span className="relative block aspect-[16/10] md:aspect-auto md:min-h-[320px] bg-chip">
              <Cover post={first} sizes="(min-width: 768px) 600px, 100vw" />
            </span>
            <span className="flex flex-col justify-center gap-2.5 p-5 sm:p-8">
              <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-subtle">
                {fmtDate(first.published_at)}
                {first.tags.length > 0 && ` · ${first.tags.join(' · ')}`}
              </span>
              <span className="font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.05]">{first.title}</span>
              {first.summary && <span className="text-muted text-[15.5px] leading-normal">{first.summary}</span>}
              <span className="text-accent text-sm font-medium mt-1">Ler post →</span>
            </span>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {rest.map((p) => (
              <Link
                key={p.slug}
                data-reveal
                href={`/blog/${p.slug}`}
                className="flex flex-col bg-surface border border-line rounded-[20px] overflow-hidden text-ink hover:text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-22px_rgba(30,28,25,.4)]"
              >
                <span className="relative block aspect-[16/9] bg-chip">
                  <Cover post={p} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
                </span>
                <span className="flex flex-col gap-1 p-4">
                  <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-subtle">{fmtDate(p.published_at)}</span>
                  <span className="font-serif text-[22px] leading-[1.1]">{p.title}</span>
                  {p.summary && <span className="text-muted text-[14px] leading-snug line-clamp-2">{p.summary}</span>}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
