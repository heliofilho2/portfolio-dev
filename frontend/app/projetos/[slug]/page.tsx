import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import Markdown from '@/components/Markdown'
import { getProject, getProjects, getProjectUpdates, initialOf, statusBg, toneBg } from '@/lib/content'

export const revalidate = 300

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

const fmtDate = (iso: string) => new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date(iso))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug)
  if (!project) return { title: 'Projeto não encontrado | helio*filho*.dev' }
  return { title: `${project.name} | helio*filho*.dev`, description: project.summary }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const [p, updates] = await Promise.all([getProject(slug), getProjectUpdates(slug)])
  if (!p) notFound()

  const meta = [
    { label: 'Tipo', value: p.type },
    { label: 'Ano', value: p.year },
    { label: 'Stack', value: p.stack },
  ].filter((m) => m.value)

  return (
    <>
      <PageReveal />
      <Header active="/projetos" />
      <main className="wrap max-w-[960px] py-8 sm:py-10 pb-16">
        <Link href="/projetos" className="font-mono text-xs tracking-[0.1em] uppercase text-subtle hover:text-ink">
          ← Projetos
        </Link>

        <div data-reveal className="mt-6">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusBg[p.status]}`}>{p.status}</span>
          <h1 className="font-serif text-[clamp(44px,6.5vw,76px)] leading-[.95] tracking-[-0.03em] mt-4 mb-3.5">{p.name}</h1>
          <p className="text-[17px] sm:text-lg leading-[1.5] text-muted max-w-[640px]">{p.summary}</p>
        </div>

        <div data-reveal className="grid grid-cols-2 md:grid-cols-4 gap-x-4 my-8 border-t border-ink border-b border-b-line">
          {meta.map((m) => (
            <div key={m.label} className="py-3.5 min-w-0">
              <div className="label">{m.label}</div>
              <div className="mt-1 font-medium text-[15px]">{m.value}</div>
            </div>
          ))}
          {(p.url || p.repo_url) && (
            <div className="py-3.5">
              <div className="label">Links</div>
              <div className="mt-1 font-medium text-[15px] flex gap-3 flex-wrap">
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    Ao vivo ↗
                  </a>
                )}
                {p.repo_url && (
                  <a href={p.repo_url} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          data-reveal
          className={`aspect-[16/9] sm:aspect-[16/8] rounded-[22px] sm:rounded-[28px] ${toneBg[p.tone]} flex items-center justify-center font-serif italic text-[clamp(88px,15vw,140px)]`}
          style={{ color: 'rgba(30,28,25,.8)' }}
        >
          {initialOf(p.name)}
        </div>

        <div className="flex flex-col gap-10 mt-10 sm:mt-12">
          {p.problem && (
            <section data-reveal className="grid gap-2 md:gap-8 md:grid-cols-[200px_minmax(0,1fr)]">
              <h2 className="h-sub">O problema</h2>
              <p className="text-base sm:text-[17px] leading-[1.7] text-ink-2">{p.problem}</p>
            </section>
          )}

          {p.solution && (
            <section data-reveal className="grid gap-2 md:gap-8 md:grid-cols-[200px_minmax(0,1fr)]">
              <h2 className="h-sub">A solução</h2>
              <p className="text-base sm:text-[17px] leading-[1.7] text-ink-2">{p.solution}</p>
            </section>
          )}

          {p.arch.length > 0 && (
            <section data-reveal>
              <h2 className="h-sub mb-4">Arquitetura</h2>
              <div className="flex gap-2 flex-wrap items-center p-4 sm:p-6 rounded-3xl bg-surface border border-line">
                {p.arch.map((label, i) => (
                  <span key={label} className="flex items-center gap-2">
                    <span className="px-3 py-2.5 rounded-xl border border-ink bg-bg font-mono text-[12px]">{label}</span>
                    {i < p.arch.length - 1 && <span className="text-subtle">→</span>}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(p.decisions.length > 0 || p.tradeoffs.length > 0) && (
            <section data-reveal className="grid gap-4 md:grid-cols-2">
              {p.decisions.length > 0 && (
                <div className="bg-mint rounded-3xl p-5 sm:p-6">
                  <h3 className="h-block mb-3">Decisões técnicas</h3>
                  {p.decisions.map((d) => (
                    <div key={d} className="py-2.5 border-t border-black/10 leading-[1.5] text-[15px]">
                      {d}
                    </div>
                  ))}
                </div>
              )}
              {p.tradeoffs.length > 0 && (
                <div className="bg-peach rounded-3xl p-5 sm:p-6">
                  <h3 className="h-block mb-3">Trade-offs</h3>
                  {p.tradeoffs.map((d) => (
                    <div key={d} className="py-2.5 border-t border-black/10 leading-[1.5] text-[15px]">
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {p.readme_md && (
            <section data-reveal className="border-t border-line pt-8">
              <div className="label mb-1">README</div>
              <Markdown>{p.readme_md}</Markdown>
            </section>
          )}

          {updates.length > 0 && (
            <section data-reveal className="border-t border-line pt-8">
              <h2 className="h-sub mb-4">Diário do projeto</h2>
              <div className="flex flex-col">
                {updates.map((u) => (
                  <article key={u.id} className="grid gap-x-5 gap-y-1 py-4 border-t border-line sm:grid-cols-[120px_minmax(0,1fr)]">
                    <span className="font-mono text-xs text-subtle sm:pt-1">{fmtDate(u.published_at)}</span>
                    <div>
                      <h3 className="font-semibold text-[16px] mb-1.5">{u.title}</h3>
                      <Markdown className="!text-[15px]">{u.body_md}</Markdown>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
