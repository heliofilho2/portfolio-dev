import Link from 'next/link'
import CategoryNav from '@/components/CategoryNav'
import PageReveal from '@/components/PageReveal'
import SubscribeBox from '@/components/SubscribeBox'
import { getEdition } from '@/lib/data'
import { usingSampleData } from '@/lib/supabase'

export const revalidate = 600

interface Props {
  searchParams: Promise<{ cat?: string; trend?: string }>
}

const dateLabel = () =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(
    new Date()
  ).replace(/^./, (c) => c.toUpperCase())

export default async function JornalPage({ searchParams }: Props) {
  const { cat, trend } = await searchParams
  const onlyTrending = trend === '1'
  const edition = await getEdition(cat ?? null, onlyTrending)
  const { lead, rest, trending, ticker, categories, total, trendingCount } = edition

  return (
    <>
      <PageReveal deps={[cat ?? '', onlyTrending]} />
      <div className="min-h-screen px-2.5 sm:px-4 py-2.5 sm:py-7 pb-10 sm:pb-12">
        <div className="max-w-[1240px] mx-auto paper rounded-[14px] sm:rounded-[20px] px-4 sm:px-8 lg:px-11 pt-4 sm:pt-7 pb-8 sm:pb-10">
          <div className="flex justify-between gap-3 font-mono text-[10.5px] sm:text-[11px] tracking-[0.14em] uppercase pb-2.5">
            <a href="https://heliofilho.dev" className="whitespace-nowrap no-underline">
              ← heliofilho.dev
            </a>
            <span className="hidden sm:inline">jornal.heliofilho.dev</span>
          </div>

          {usingSampleData && (
            <p className="text-center font-mono text-[11px] text-red mb-2">
              Dados de exemplo. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
            </p>
          )}

          <header data-reveal className="flex flex-wrap justify-center gap-3 sm:gap-6 items-center border-t border-ink pt-3.5">
            <div className="order-1 flex-[0_1_170px] border border-box rounded-xl bg-paper px-3 py-2.5 text-center text-xs leading-[1.4]">
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase border-b border-ink pb-1.5 mb-1.5">Edição de hoje</div>
              Atualizado a cada duas horas, com nove fontes lidas.
            </div>
            <div className="order-0 flex-[1_1_100%] text-center">
              <div className="font-serif text-[clamp(44px,9vw,112px)] leading-[.92] tracking-[-0.03em] whitespace-nowrap">
                O Jornal <em className="text-accent">Tech</em>
              </div>
              <div className="italic text-[14px] sm:text-[15px] mt-2.5 sm:mt-3.5">&ldquo;Tudo que importa em tecnologia, e nada do que não importa.&rdquo;</div>
            </div>
            <div className="order-2 flex-[0_1_170px] border border-box rounded-xl bg-paper px-3 py-2.5 text-center text-xs leading-[1.4]">
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase border-b border-ink pb-1.5 mb-1.5">Preço</div>
              <span className="font-serif text-[26px] sm:text-[30px]">R$ 0,00</span>
              <br />
              para sempre
            </div>
          </header>

          <div className="mt-4 border-t-[1.5px] border-ink border-b border-b-ink pt-0.5">
            <div className="border-t border-ink py-1.5 flex justify-between gap-3 sm:gap-6 whitespace-nowrap font-mono text-[10.5px] sm:text-xs tracking-[0.12em] uppercase">
              <span className="hidden md:inline">Edição diária</span>
              <span className="truncate">{dateLabel()}</span>
              <span>
                {total} notícias · {trendingCount} em alta
              </span>
            </div>
          </div>

          <CategoryNav available={categories} activeCat={cat ?? 'Tudo'} onlyTrending={onlyTrending} />

          <main className="grid gap-7 mt-5 sm:mt-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <article data-reveal className="min-w-0">
              {lead ? (
                <>
                  <div className="font-mono text-xs tracking-[0.16em] uppercase text-red">{lead.kicker}</div>
                  <h1 className="font-serif text-[clamp(34px,4.8vw,60px)] leading-[.98] tracking-[-0.01em] mt-2 mb-3.5 text-balance">
                    {lead.body_pt ? <Link href={`/materia/${lead.id}`}>{lead.title_pt}</Link> : lead.title_pt}
                  </h1>
                  <div className="font-mono text-[11.5px] tracking-[0.12em] uppercase border-t border-b border-ink py-1.5 mb-4.5">
                    Por robô coletor · revisado por Hélio Filho ·{' '}
                    <a href={lead.url} target="_blank" rel="noopener noreferrer">
                      {lead.source} ↗
                    </a>
                  </div>
                  <figure className="mb-4.5">
                    <div
                      className="aspect-[16/8] rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: '#E4DEF7', backgroundImage: 'radial-gradient(rgba(79,70,200,.28) 1.2px,transparent 1.4px)', backgroundSize: '7px 7px' }}
                    >
                      <span className="bg-paper rounded-full px-3 py-1.5 whitespace-nowrap font-mono text-[11px] tracking-[0.14em] uppercase">
                        Foto da matéria
                      </span>
                    </div>
                    <figcaption className="text-[12.5px] italic pt-1.5 border-b border-rule pb-2">
                      Ilustração: imagem gerada a partir da notícia principal do dia.
                    </figcaption>
                  </figure>
                  <div className="text-[15.5px] leading-[1.62] text-left sm:text-justify [hyphens:auto] sm:columns-2 sm:gap-7" style={{ columnRuleWidth: 1, columnRuleStyle: 'solid', columnRuleColor: '#E2DACA' }}>
                    <p className="drop-cap mb-3">{lead.summary_pt}</p>
                  </div>
                  {lead.body_pt && (
                    <Link href={`/materia/${lead.id}`} className="inline-block font-mono text-[11px] tracking-[0.12em] uppercase text-accent">
                      Ler a matéria completa →
                    </Link>
                  )}
                </>
              ) : (
                <div className="py-20 text-center italic text-2xl">Nenhuma notícia com esse filtro nesta edição.</div>
              )}
            </article>

            <aside className="min-w-0 flex flex-col gap-5.5 border-t border-rule pt-6 lg:border-t-0 lg:pt-0 lg:pl-7 lg:border-l">
              <div data-reveal>
                <div className="font-mono text-[13px] tracking-[0.16em] uppercase border-t-[1.5px] border-b border-ink py-1.5 flex justify-between">
                  <span>Em alta</span>
                  <span className="text-red">●</span>
                </div>
                {trending.length > 0 ? (
                  trending.map((t, i) => (
                    <div key={t.title_pt} className="grid gap-2 py-3 border-b border-rule" style={{ gridTemplateColumns: '36px minmax(0,1fr)' }}>
                      <span className="num text-3xl leading-none">{i + 1}</span>
                      <span>
                        <span className="block font-serif text-[17px] leading-[1.2]">
                          {t.body_pt ? <Link href={`/materia/${t.id}`}>{t.title_pt}</Link> : t.title_pt}
                        </span>
                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="block font-mono text-[10.5px] tracking-[0.12em] uppercase mt-1">
                          {t.source} ↗
                        </a>
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-sm italic">Nada em alta nesta edição.</p>
                )}
              </div>
              <div data-reveal>
                <div className="font-mono text-[13px] tracking-[0.16em] uppercase border-t-[1.5px] border-b border-ink py-1.5">Cotação das fontes</div>
                {ticker.map((k) => (
                  <div key={k.name} className="flex justify-between py-1.5 border-b border-dotted border-[#9A917E] text-[13.5px]">
                    <span>{k.name}</span>
                    <span className={`font-mono tracking-[0.06em] ${k.colorClass}`}>
                      {k.arrow} {k.today}
                    </span>
                  </div>
                ))}
                <div className="text-[11.5px] italic mt-1.5">Notícias publicadas por fonte hoje, comparadas a ontem.</div>
              </div>
              <div data-reveal className="border border-box rounded-2xl bg-charge p-3">
                <div className="font-mono text-xs tracking-[0.16em] uppercase text-center pb-2">A charge</div>
                <div
                  className="aspect-square rounded-[10px] flex items-center justify-center text-center italic text-[15px] p-4"
                  style={{ border: '1.5px dashed rgba(122,100,32,.4)', color: 'var(--color-charge-ink)' }}
                >
                  espaço para a charge do dia
                </div>
                <div className="text-[12.5px] italic text-center pt-2">por Hélio</div>
              </div>
            </aside>
          </main>

          {rest.length > 0 && (
            <>
              <div className="border-t-[1.5px] border-ink mt-8 pt-0.5">
                <div className="border-t border-ink" />
              </div>
              <section className="grid mt-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))' }}>
                {rest.map((n) => (
                  <article key={n.title_pt} data-reveal className="pt-4 sm:pt-1 pb-5 border-t border-rule sm:border-t-0 sm:px-5 sm:border-l mb-0 sm:mb-3">
                    <div className={`font-mono text-[11px] tracking-[0.14em] uppercase ${n.priority === 'alta' && n.trending ? 'text-red' : ''}`}>
                      {n.kicker}
                    </div>
                    <h3 className="font-serif text-[21px] leading-[1.12] mt-1.5 mb-2 text-pretty">
                      {n.body_pt ? <Link href={`/materia/${n.id}`}>{n.title_pt}</Link> : n.title_pt}
                    </h3>
                    <p className="text-[14.5px] leading-[1.55] mb-2 sm:text-justify [hyphens:auto]">{n.summary_pt}</p>
                    <div className="text-xs italic">
                      <a href={n.url} target="_blank" rel="noopener noreferrer" className="not-italic">
                        {n.source} ↗
                      </a>{' '}
                      · {n.timeLabel}
                    </div>
                  </article>
                ))}
              </section>
            </>
          )}

          <section data-reveal className="mt-7">
            <div className="text-center border-t-[1.5px] border-b border-ink py-2 font-serif text-[24px] sm:text-[26px] tracking-[0.02em] italic">
              Classificados
            </div>
            <div className="grid gap-3.5 mt-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,230px),1fr))' }}>
              <div className="border border-box rounded-2xl bg-paper p-4 text-[13.5px] leading-[1.5]">
                <div className="font-mono text-sm tracking-[0.14em] uppercase border-b border-ink pb-1.5 mb-2">Assina-se</div>
                <strong>A carta de sexta.</strong> Resumo do jornal, bastidores e cofre, às 7h.
                <SubscribeBox />
              </div>
              <div className="border border-box rounded-2xl bg-paper p-4 text-[13.5px] leading-[1.5]">
                <div className="font-mono text-sm tracking-[0.14em] uppercase border-b border-ink pb-1.5 mb-2">Procura-se</div>
                Leitores com boa memória para o <strong>jogo diário</strong>: uma pergunta por dia sobre esta edição. Ranking semanal. <em>Em breve.</em>
              </div>
              <div className="border border-box rounded-2xl bg-paper p-4 text-[13.5px] leading-[1.5]">
                <div className="font-mono text-sm tracking-[0.14em] uppercase border-b border-ink pb-1.5 mb-2">Doa-se</div>
                Repos, livros e a página de cada vídeo. Nada à venda:{' '}
                <a href="https://heliofilho.dev/cofre">abra o cofre</a>.
              </div>
              <div className="border border-box rounded-2xl bg-paper p-4 text-[13.5px] leading-[1.5]">
                <div className="font-mono text-sm tracking-[0.14em] uppercase border-b border-ink pb-1.5 mb-2">Anuncie</div>
                Espaço para marcas que fazem sentido para quem programa.{' '}
                <a href="https://heliofilho.dev/#midiakit">Media kit</a>.
              </div>
            </div>
          </section>

          <footer className="mt-7 border-t border-ink pt-2.5 flex justify-between gap-3 flex-wrap text-xs italic">
            <span>O Jornal Tech é coletado automaticamente de nove fontes e revisado à mão.</span>
            <span>
              Um projeto de <a href="https://heliofilho.dev">heliofilho.dev</a>
            </span>
          </footer>
        </div>
      </div>
    </>
  )
}
