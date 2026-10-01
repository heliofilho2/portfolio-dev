import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageReveal from '@/components/PageReveal'
import { getArticle } from '@/lib/data'

export const revalidate = 600

interface Props {
  params: Promise<{ id: string }>
}

const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(
    new Date(iso)
  )

async function load(params: Props['params']) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) return null
  return getArticle(id)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await load(params)
  if (!article) return { title: 'Matéria não encontrada | O Jornal Tech' }
  return { title: `${article.title_pt} | O Jornal Tech`, description: article.summary_pt }
}

export default async function ArticlePage({ params }: Props) {
  const article = await load(params)
  if (!article) notFound()

  const paragraphs = (article.body_pt ?? '').split(/\n\s*\n/).filter((p) => p.trim())

  return (
    <>
      <PageReveal />
      <div className="min-h-screen px-2.5 sm:px-4 py-2.5 sm:py-7 pb-10 sm:pb-12">
        <div className="max-w-[780px] mx-auto paper rounded-[14px] sm:rounded-[20px] px-4 sm:px-8 lg:px-11 pt-4 sm:pt-7 pb-8 sm:pb-10">
          <div className="flex justify-between gap-3 font-mono text-[10.5px] sm:text-[11px] tracking-[0.14em] uppercase pb-2.5">
            <Link href="/" className="whitespace-nowrap no-underline">
              ← O Jornal Tech
            </Link>
            <a href="https://heliofilho.dev" className="hidden sm:inline">
              heliofilho.dev
            </a>
          </div>

          <article data-reveal className="border-t border-ink pt-5">
            <div className="font-mono text-xs tracking-[0.16em] uppercase text-red">{article.kicker}</div>
            <h1 className="font-serif text-[clamp(32px,5vw,52px)] leading-[1.02] tracking-[-0.01em] mt-2 mb-3.5 text-balance">{article.title_pt}</h1>
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase border-t border-b border-ink py-1.5 mb-5">
              Por robô coletor · revisado por Hélio Filho ·{' '}
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.source} ↗
              </a>
              <span className="block sm:inline sm:ml-2 normal-case tracking-normal text-subtle">{dateLabel(article.published_at)}</span>
            </div>

            {article.image_url && (
              <figure className="mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image_url} alt="" className="w-full aspect-[16/9] rounded-2xl object-cover" />
                <figcaption className="text-[12.5px] italic pt-1.5">Foto: {article.source}</figcaption>
              </figure>
            )}

            {/* Sem drop-cap aqui: aquele efeito depende do layout em colunas da manchete da
                home (globals.css usa float, que quebra largura dentro de flex-col estreito). */}
            <div className="text-[16px] leading-[1.7] flex flex-col gap-4">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 border border-box rounded-2xl bg-paper px-4 py-3.5 text-[13.5px] leading-[1.5]">
              Esta matéria foi escrita a partir do texto original, indicado acima. Divergências de interpretação devem ser conferidas na fonte.
              <br />
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-medium">
                Ler a matéria original em {article.source} ↗
              </a>
            </div>
          </article>

          <footer className="mt-7 border-t border-ink pt-2.5 text-xs italic">
            <Link href="/">← Voltar para a edição de hoje</Link>
          </footer>
        </div>
      </div>
    </>
  )
}
