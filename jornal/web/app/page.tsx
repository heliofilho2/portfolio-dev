import NewsFeed from '@/components/NewsFeed'
import SubscribeForm from '@/components/SubscribeForm'
import { getEdition, usingSampleData } from '@/lib/news'
import { getLatestPost } from '@/lib/newsletter'

// O coletor roda a cada 2h; 10 min de cache é folga suficiente
export const revalidate = 600

const todayLabel = () =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date())

export default async function Home() {
  const [items, latestPost] = await Promise.all([getEdition(), getLatestPost()])
  const [lead, ...rest] = items

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-8 pb-24">
      {usingSampleData && (
        <p className="mt-4 font-mono text-xs text-rust">
          Dados de exemplo — configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ver as notícias reais.
        </p>
      )}

      <header className="pt-12 pb-6 flex flex-col gap-2">
        <div className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
          Curadoria diária · <span className="capitalize">{todayLabel()}</span>
        </div>
        <h1 className="text-5xl sm:text-[52px] font-bold tracking-[-0.01em]">SINAL</h1>
        <p className="text-base text-muted max-w-[560px]">
          IA, tecnologia e engenharia de software, sem sensacionalismo. Uma seleção diária, com fonte sempre citada — por{' '}
          <a href="https://heliofilho.dev" className="underline underline-offset-2">
            @heliofilhou
          </a>
          .
        </p>
      </header>
      <hr className="border-rule" />

      {lead ? (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8 py-8 border-b border-rule">
          <article className="flex flex-col gap-3">
            <div className="label">Destaque do dia</div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
              <span>{lead.category}</span>
              {lead.trending && <span className="font-semibold text-rust normal-case">● EM ALTA</span>}
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
              <a href={lead.url} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-teal">
                {lead.title_pt}
              </a>
            </h2>
            <p className="text-lg leading-relaxed text-ink-2 max-w-2xl">{lead.summary_pt}</p>
            <p className="font-mono text-xs text-muted">
              {lead.source} · {lead.timeLabel}
            </p>
          </article>

          <aside className="flex flex-col gap-6 lg:border-l lg:border-rule lg:pl-8">
            {latestPost && (
              <div className="flex flex-col gap-2">
                <div className="label">Coluna · Newsletter</div>
                <h2 className="text-xl font-semibold leading-snug">
                  <a href={latestPost.url} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-teal">
                    {latestPost.title}
                  </a>
                </h2>
                {latestPost.excerpt && <p className="text-sm text-muted leading-relaxed">{latestPost.excerpt}</p>}
              </div>
            )}
            <SubscribeForm />
          </aside>
        </div>
      ) : (
        <div className="py-16 grid lg:grid-cols-[2fr_1fr] gap-8">
          <p className="text-muted">A primeira edição está sendo preparada. Volte em algumas horas.</p>
          <SubscribeForm />
        </div>
      )}

      {rest.length > 0 && <NewsFeed items={rest} />}

      <hr className="border-rule" />
      <footer className="py-6 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-faint">
        <span>SINAL — resumos gerados com IA a partir das fontes citadas; confira sempre o original.</span>
        <a href="https://heliofilho.dev" className="text-faint hover:text-teal">
          heliofilho.dev
        </a>
      </footer>
    </div>
  )
}
