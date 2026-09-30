import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import CopyEmailButton from '@/components/CopyEmailButton'
import NewsletterForm from '@/components/NewsletterForm'
import ProjectRow from '@/components/ProjectRow'
import CofreCard from '@/components/CofreCard'
import MediaImg from '@/components/MediaImg'
import { fmtDate, getCofreItems, getPosts, getProjects } from '@/lib/content'
import { getJornalPreview } from '@/lib/jornalPreview'
import { getSiteSettings } from '@/lib/settings'
import { toneClass } from '@/lib/socials'

export const revalidate = 300

function SectionHead({ label, title, note, href, cta }: { label: string; title: React.ReactNode; note?: string; href?: string; cta?: string }) {
  return (
    <div className="flex justify-between items-end gap-x-4 gap-y-2 mb-6 flex-wrap">
      <div>
        <div className="label">{label}</div>
        <h2 className="h-section mt-1.5">
          {title}{' '}
          {note && <span className="hand-note -rotate-3 ml-1 align-middle whitespace-nowrap">{note}</span>}
        </h2>
      </div>
      {href && (
        <Link href={href} className="text-sm font-medium text-accent whitespace-nowrap">
          {cta}
        </Link>
      )}
    </div>
  )
}

export default async function Home() {
  const [projects, cofre, posts, jornal, site] = await Promise.all([getProjects(), getCofreItems(), getPosts(), getJornalPreview(), getSiteSettings()])
  const { socials, reels, contact_email: contactEmail } = site
  const instagram = socials.find((s) => s.name.toLowerCase() === 'instagram')?.url ?? 'https://www.instagram.com/heliofilhou/'
  const contactLinks = socials.filter((s) => ['linkedin', 'github'].includes(s.name.toLowerCase()))
  // Numeração das seções (01 · Instagram...): o blog só entra quando tem post.
  const sections = ['Instagram', 'Projetos', 'Cofre', ...(posts.length ? ['Blog'] : []), 'Newsletter', 'Redes', 'Parcerias', 'Contato']
  const label = (name: string) => `${String(sections.indexOf(name) + 1).padStart(2, '0')} · ${name}`
  const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date())
    .replace(/^./, (c) => c.toUpperCase())

  return (
    <>
      <PageReveal />
      <Header active="/" />
      <main className="wrap">
        {/* Faixa de edição */}
        <div data-reveal className="flex justify-between gap-3 whitespace-nowrap py-3.5 border-b border-line font-mono text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-subtle">
          <span className="truncate">{today}</span>
          <span className="hidden md:inline">Tecnologia, IA e código em português</span>
          <a href="https://jornal.heliofilho.dev" target="_blank" rel="noopener noreferrer" className="text-accent">
            Hoje no jornal{jornal.count > 0 ? `: ${jornal.count}` : ''} ↗
          </a>
        </div>

        {/* Hero */}
        <section className="pt-12 pb-14 sm:pt-14 sm:pb-16">
          <div data-reveal className="flex flex-col items-center text-center gap-3.5">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-surface shadow-[0_0_0_1px_#E4DDD0,0_18px_36px_-20px_rgba(30,28,25,.35)]">
                <MediaImg src={site.avatar_url} alt="Hélio Filho" width={112} height={112} priority className="w-full h-full object-cover" />
              </div>
              <span className="absolute right-[-4px] bottom-1.5 w-4.5 h-4.5 rounded-full bg-online border-[3px] border-bg" />
            </div>
            {site.hand_note && <div className="hand-note -rotate-2">{site.hand_note}</div>}
            <h1 className="h-display">
              Hélio <em className="text-accent">Filho</em>
            </h1>
            <p className="text-base sm:text-[17px] text-muted max-w-[500px] leading-[1.55]">
              {site.bio}
            </p>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center mt-1">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium text-ink hover:text-ink whitespace-nowrap transition-transform hover:-translate-y-0.5 ${toneClass[s.tone]}`}
                >
                  {s.name}
                  {s.count && ` · ${s.count}`}
                </a>
              ))}
            </div>
            <div className="flex gap-x-3 gap-y-2 flex-wrap justify-center items-center mt-2.5">
              <CopyEmailButton email={contactEmail} />
              <Link href="/newsletter" className="px-3 py-2 text-sm font-medium text-ink hover:text-accent border-b border-ink whitespace-nowrap">
                Assinar a carta de sexta →
              </Link>
            </div>
          </div>
        </section>

        {/* Reels + Jornal */}
        <section data-reveal className="border-t border-line py-10 sm:py-12">
          <div className="flex flex-wrap gap-8 lg:gap-10">
            <div className="flex-[2_1_480px] min-w-0">
              <SectionHead
                label={label('Instagram')}
                title={
                  <>
                    Reels <em className="text-accent">recentes</em>
                  </>
                }
                note="YouTube vem aí!"
              />
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar sm:grid-cols-4">
                {reels.slice(0, 4).map((v, i) => (
                  <a
                    key={`${v.title}-${i}`}
                    href={v.url || instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="snap-start shrink-0 w-[42%] sm:w-auto block text-ink hover:text-ink bg-surface border border-ink rounded-2xl overflow-hidden shadow-[3px_3px_0_#1E1C19] transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#1E1C19]"
                  >
                    <div className={`aspect-[9/14] ${toneClass[v.tone]} relative flex items-center justify-center overflow-hidden`}>
                      {v.image_url && <MediaImg src={v.image_url} alt="" fill sizes="(min-width: 640px) 180px, 42vw" className="object-cover" />}
                      <span className="absolute top-2 left-2 font-mono text-[10px] bg-surface px-2 py-0.5 rounded-full">Reel</span>
                      <span className="relative w-10 h-10 rounded-full bg-surface flex items-center justify-center text-[13px] pl-0.5">▶</span>
                      {v.views && <span className="absolute bottom-2 left-2 font-mono text-[10px] bg-ink text-surface px-2 py-0.5 rounded-full whitespace-nowrap">▶ {v.views}</span>}
                    </div>
                    <div className="px-3 pt-2.5 pb-3 font-semibold text-[13.5px] leading-tight">{v.title}</div>
                  </a>
                ))}
              </div>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-medium">
                Ver no Instagram ↗
              </a>
            </div>
            <aside className="flex-[1_1_280px] min-w-0 bg-surface border border-line rounded-[22px] px-5 sm:px-6 py-5">
              <div className="label">Nesta edição</div>
              <h3 className="h-block mt-1.5 mb-1">
                Hoje no <em>jornal</em>
              </h3>
              <p className="text-muted text-sm leading-[1.55] mb-4">Curado por robô, revisado por mim. Atualiza a cada duas horas.</p>
              {jornal.items.length > 0 ? (
                <div className="flex flex-col">
                  {jornal.items.map((n) => (
                    <a key={n.title} href="https://jornal.heliofilho.dev" target="_blank" rel="noopener noreferrer" className="flex gap-3 py-3 border-t border-line text-ink hover:text-accent">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                      <span className="flex flex-col gap-1">
                        <span className="text-[14.5px] leading-[1.35] font-medium">{n.title}</span>
                        <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-subtle">{n.meta}</span>
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="py-5 text-sm text-subtle border-t border-line">Edição em preparo. Volte em algumas horas.</p>
              )}
              <a
                href="https://jornal.heliofilho.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center mt-3 px-4 py-3.5 rounded-2xl bg-accent text-surface hover:text-surface font-medium text-[14.5px]"
              >
                Abrir o jornal completo <span>→</span>
              </a>
            </aside>
          </div>
        </section>

        {/* Projetos */}
        <section data-reveal className="border-t border-line py-10 sm:py-12">
          <SectionHead
            label={label('Projetos')}
            title={
              <>
                O que eu <em className="text-accent">construo</em>
              </>
            }
            note="(e às vezes largo)"
            href="/projetos"
            cta="Todos os projetos →"
          />
          <div className="flex flex-col gap-2">
            {projects.slice(0, 4).map((p, i) => (
              <ProjectRow key={p.slug} project={p} n={i + 1} />
            ))}
            {projects.length === 0 && <p className="text-muted">Projetos em preparo.</p>}
          </div>
        </section>

        {/* Cofre */}
        <section data-reveal className="border-t border-line py-10 sm:py-12">
          <SectionHead
            label={label('Cofre')}
            title={
              <>
                Materiais <em className="text-accent">gratuitos</em>
              </>
            }
            note="sem cadastro, juro"
            href="/cofre"
            cta="Abrir o cofre →"
          />
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {cofre.slice(0, 4).map((c) => (
              <CofreCard key={c.slug} item={c} variant="row" />
            ))}
          </div>
        </section>

        {/* Blog: só aparece quando tem post */}
        {posts.length > 0 && (
          <section data-reveal className="border-t border-line py-10 sm:py-12">
            <SectionHead
              label={label('Blog')}
              title={
                <>
                  Do <em className="text-accent">blog</em>
                </>
              }
              note="bastidores e relatórios"
              href="/blog"
              cta="Todos os posts →"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col bg-surface border border-line rounded-[20px] overflow-hidden text-ink hover:text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-22px_rgba(30,28,25,.4)]"
                >
                  {p.cover_url ? (
                    <span className="relative block aspect-[16/9] bg-chip">
                      <MediaImg src={p.cover_url} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    </span>
                  ) : (
                    <span className="block aspect-[16/9] bg-lilac" style={{ backgroundImage: 'radial-gradient(rgba(79,70,200,.22) 1.2px,transparent 1.4px)', backgroundSize: '8px 8px' }} />
                  )}
                  <span className="flex flex-col gap-1 p-4">
                    <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-subtle">{fmtDate(p.published_at)}</span>
                    <span className="font-serif text-[22px] leading-[1.1]">{p.title}</span>
                    {p.summary && <span className="text-muted text-[14px] leading-snug line-clamp-2">{p.summary}</span>}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section data-reveal className="py-4 pb-10 sm:pb-12">
          <div className="bg-lilac border border-ink rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 lg:p-12 grid gap-6 lg:gap-10 items-center lg:grid-cols-2 shadow-[4px_4px_0_#1E1C19]">
            <div>
              <div className="label text-accent">{label('Newsletter')}</div>
              <h2 className="font-serif text-[clamp(32px,4.4vw,50px)] tracking-[-0.02em] mt-2 leading-none">
                Uma carta por semana. <em>Sem enrolação.</em>
              </h2>
              <p className="text-ink-2 text-[15px] sm:text-base leading-[1.55] mt-3.5 max-w-[440px]">
                O resumo do jornal, o bastidor dos vídeos e o material novo do cofre. Toda sexta, às 7h.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>

        {/* Redes */}
        <section data-reveal className="border-t border-line py-10 sm:py-12">
          <SectionHead
            label={label('Redes')}
            title={
              <>
                Me acompanhe <em className="text-accent">por aí</em>
              </>
            }
          />
          <div className="grid gap-2.5 sm:gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col gap-5 p-4 sm:p-5 rounded-[18px] text-ink hover:text-ink transition-transform duration-300 hover:-translate-y-1 ${toneClass[s.tone]}`}
              >
                <span className="flex justify-between font-semibold text-[15px]">
                  {s.name}
                  <span>↗</span>
                </span>
                <span className="min-w-0">
                  <span className="block font-serif text-[28px] sm:text-[32px] leading-none">{s.count || 'seguir'}</span>
                  <span className="font-mono text-[11px] text-muted truncate block">{s.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Media kit + Contato */}
        <section id="midiakit" data-reveal className="border-t border-line py-10 sm:py-12 pb-14 grid gap-4 md:grid-cols-2">
          <div className="bg-peach border border-ink rounded-[24px] p-6 sm:p-8 flex flex-col gap-3.5 shadow-[4px_4px_0_#1E1C19]">
            <div className="label" style={{ color: '#8A5A3E' }}>
              {label('Parcerias')}
            </div>
            <h3 className="h-block">Marcas que fazem sentido pra quem programa.</h3>
            <p className="text-[#5E4A3E] text-[15px] leading-[1.55]">Integrações em vídeo, newsletter e jornal. Audiência de devs e estudantes de tecnologia no Brasil.</p>
            <a href={`mailto:${contactEmail}?subject=Media%20kit`} className="self-start mt-1 px-4.5 py-2.5 rounded-full bg-ink text-surface hover:text-surface text-[14.5px] font-medium">
              Pedir o media kit →
            </a>
          </div>
          <div className="bg-surface border border-line rounded-[24px] p-6 sm:p-8 flex flex-col gap-3.5">
            <div className="label">{label('Contato')}</div>
            <h3 className="h-block">Bora conversar?</h3>
            <p className="text-muted text-[15px] leading-[1.55]">Projeto, parceria ou só uma dúvida de código. Respondo em até 2 dias úteis.</p>
            <div className="flex flex-col mt-1 text-[15px]">
              <a href={`mailto:${contactEmail}`} className="flex justify-between gap-3 py-3 border-t border-line text-ink hover:text-accent min-w-0">
                <span className="truncate">{contactEmail}</span> <span>→</span>
              </a>
              {contactLinks.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex justify-between py-3 border-t border-line last:border-b text-ink hover:text-accent">
                  {s.name} <span>↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
