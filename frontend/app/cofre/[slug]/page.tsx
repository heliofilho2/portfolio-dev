import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import Markdown from '@/components/Markdown'
import NewsletterForm from '@/components/NewsletterForm'
import MediaBlock, { embedOf } from '@/components/MediaBlock'
import MediaImg from '@/components/MediaImg'
import { fmtDate, getCofreItem, getCofreItems, initialOf, toneBg, type CofreItem } from '@/lib/content'

export const revalidate = 300

// Pré-gera as páginas existentes; item novo é gerado no primeiro acesso.
export async function generateStaticParams() {
  return (await getCofreItems()).map((c) => ({ slug: c.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

const isVideoFile = (url: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getCofreItem((await params).slug)
  if (!item) return { title: 'Não encontrado | helio*filho*.dev' }
  return {
    title: `${item.title} | Cofre do Hélio`,
    description: item.summary,
    openGraph: { title: item.title, description: item.summary, url: `https://heliofilho.dev/cofre/${item.slug}`, images: ['/helio.jpg'] },
  }
}

function Breadcrumb({ item }: { item: CofreItem }) {
  return (
    <div className="font-mono text-[11px] sm:text-xs tracking-[0.1em] uppercase text-subtle flex gap-2 min-w-0">
      <Link href="/cofre" className="text-subtle hover:text-ink shrink-0">
        Cofre
      </Link>
      <span>/</span>
      <span className="shrink-0">{item.category}</span>
      <span className="hidden sm:inline">/</span>
      <span className="hidden sm:inline text-ink truncate">{item.title}</span>
    </div>
  )
}

function NewsletterBox() {
  return (
    <div className="bg-butter rounded-3xl p-5 flex flex-col gap-3">
      <span className="font-serif text-[22px] leading-[1.1]">Quer o próximo achado antes de todo mundo?</span>
      <NewsletterForm variant="block" ctaLabel="Assinar" />
    </div>
  )
}

export default async function CofreItemPage({ params }: Props) {
  const { slug } = await params
  const [item, all] = await Promise.all([getCofreItem(slug), getCofreItems()])
  if (!item) notFound()

  const isVideo = item.category === 'Vídeos'
  // Recomendação por relevância: mesmo tema primeiro, depois mesma categoria, só por último o resto do cofre.
  // Cada nível só entra se o anterior não encheu a lista, evita repetir item e evita "relacionado" fraco quando tem opção melhor.
  const topicMatches = item.topic ? all.filter((c) => c.slug !== item.slug && c.topic === item.topic) : []
  const categoryMatches = all.filter((c) => c.slug !== item.slug && c.category === item.category && !topicMatches.includes(c))
  const siblings = [...topicMatches, ...categoryMatches].slice(0, 6)
  const more = siblings.length > 0 ? siblings : all.filter((c) => c.slug !== item.slug).slice(0, 4)
  const moreLabel = topicMatches.length > 0 ? `Mais em ${item.topic}` : siblings.length > 0 ? `Mais em ${item.category}` : 'Talvez isso também te interesse'

  return (
    <>
      <PageReveal />
      <Header active="/cofre" />
      <main className="wrap py-7 sm:py-9 pb-16">
        <Breadcrumb item={item} />

        <div className="grid gap-8 lg:gap-12 mt-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <article data-reveal className="min-w-0">
            {/* Quem clica no link do vídeo já quer o material, não rever o vídeo - a lista vem
                primeiro, antes de qualquer coisa, pra não exigir rolar passando o vídeo de novo
                no celular (onde a coluna lateral de baixo empilha só depois de tudo isso). */}
            {isVideo && item.materials.length > 0 && (
              <div className="bg-surface border border-line rounded-3xl p-5 mb-6">
                <h3 className="h-block mb-2.5">Materiais do vídeo</h3>
                {item.materials.map((m) => {
                  const inner = (
                    <>
                      <span className="flex-1 min-w-0 flex flex-col">
                        <span className="font-medium text-[15px] truncate">{m.label}</span>
                        {m.sub && <span className="text-[12.5px] text-subtle">{m.sub}</span>}
                      </span>
                      {m.url && <span className="text-subtle">↗</span>}
                    </>
                  )
                  return m.url ? (
                    <a key={m.label} href={m.url} target="_blank" rel="noopener noreferrer" className="flex gap-3 items-center py-2.5 border-t border-line text-ink hover:text-accent">
                      {inner}
                    </a>
                  ) : (
                    <div key={m.label} className="flex gap-3 items-center py-2.5 border-t border-line">
                      {inner}
                    </div>
                  )
                })}
              </div>
            )}

            {isVideo && (
              <div className="label text-subtle mb-2">Rever o vídeo</div>
            )}
            <div className={isVideo ? 'max-w-[300px]' : ''}>
              {isVideo && item.video_url && (embedOf(item.video_url) || isVideoFile(item.video_url)) ? (
                <div className="[&_.md-media]:m-0">
                  <MediaBlock src={item.video_url} alt="" />
                </div>
              ) : isVideo ? (
                <a
                  href={item.video_url ?? 'https://www.instagram.com/heliofilhou/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`aspect-video rounded-[22px] sm:rounded-3xl ${toneBg[item.tone]} flex flex-col gap-3 items-center justify-center text-ink hover:text-ink group`}
                >
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface flex items-center justify-center text-xl sm:text-2xl pl-1 shadow-[0_16px_32px_-16px_rgba(30,28,25,.4)] transition-transform duration-300 group-hover:scale-105">
                    ▶
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase">{item.video_url ? 'Assistir o vídeo' : 'Assistir no Instagram'}</span>
                </a>
              ) : item.cover_url ? (
                <div className="relative aspect-[16/9] rounded-[22px] sm:rounded-3xl overflow-hidden bg-chip">
                  <MediaImg src={item.cover_url} alt="" fill priority sizes="(min-width: 1024px) 740px, 100vw" className="object-cover" />
                </div>
              ) : (
                <span className={`w-14 h-14 rounded-full ${toneBg[item.tone]} flex items-center justify-center font-serif italic text-[28px]`}>{initialOf(item.title)}</span>
              )}
            </div>

            <div className={`label text-accent ${isVideo ? 'mt-6' : 'mt-5'}`}>
              {isVideo ? `Vídeo · ${fmtDate(item.published_at)}` : (item.topic ?? item.category)}
            </div>
            <h1 className="font-serif text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.02em] mt-2 mb-3.5">{item.title}</h1>
            <p className="text-[17px] leading-[1.6] text-muted mb-7 max-w-[640px]">{item.summary}</p>

            {item.chapters.length > 0 && (
              <div className="mb-8">
                <h2 className="h-sub mb-2">Capítulos</h2>
                {item.chapters.map((c) => (
                  <div key={c.t} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 py-3 border-t border-line">
                    <span className="font-mono text-[13px] text-accent">{c.t}</span>
                    <span className="text-[15px]">{c.label}</span>
                  </div>
                ))}
              </div>
            )}

            <Markdown>{item.body_md}</Markdown>
          </article>

          <aside data-reveal className="flex flex-col gap-3.5 self-start lg:sticky lg:top-24">
            {isVideo && (
              <div className="bg-mint rounded-3xl p-5 text-[14.5px] leading-[1.5]" style={{ color: '#2E4A38' }}>
                <strong className="font-semibold">Salvo no cofre.</strong> Esta página fica disponível pra sempre em Cofre, na aba Vídeos.
              </div>
            )}

            {!isVideo && more.length > 0 && (
              <div className="bg-surface border border-line rounded-3xl p-5">
                <h3 className="h-block mb-2.5">{moreLabel}</h3>
                {more.map((c) => (
                  <Link key={c.slug} href={`/cofre/${c.slug}`} className="flex gap-3 items-center py-2.5 border-t border-line text-ink hover:text-accent">
                    <span className={`w-8 h-8 rounded-full shrink-0 ${toneBg[c.tone]} flex items-center justify-center font-serif italic text-[15px]`}>{initialOf(c.title)}</span>
                    <span className="flex-1 min-w-0 font-medium text-[15px] truncate">{c.title}</span>
                    <span className="text-subtle">→</span>
                  </Link>
                ))}
              </div>
            )}

            <NewsletterBox />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
