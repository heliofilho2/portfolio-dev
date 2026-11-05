import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import PrintButton from '@/components/PrintButton'
import MediaImg from '@/components/MediaImg'
import { getMediaKitData, getOslinkeData, getTopReels, compactCount, type MediaKitData } from '@/lib/oslinke'
import { kToMil, ptDay, ptLong, ptPct, ptShort } from '@/lib/mediaKitFormat'
import { getSiteSettings } from '@/lib/settings'

// Os números vêm do Oslinke (Insights API do Instagram), que guarda 3 horas em cache.
export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Mídia Kit | helio*filho*.dev',
  description:
    'Mídia kit do @heliofilhou: tecnologia, IA e reviews explicados para qualquer pessoa. Visualizações, público e reels de destaque atualizados direto do Instagram.',
}

const TAGLINE = 'Desenvolvedor que explica tecnologia, IA e as histórias por trás das big techs, do jeito que qualquer pessoa entende.'

const FORMATS = [
  {
    title: 'Reels com história',
    text: 'O produto entra numa história de tecnologia com gancho em assunto do momento, o formato dos vídeos que passaram de 1 milhão.',
    tone: 'bg-lilac',
  },
  {
    title: 'Desafio "a IA escolheu"',
    text: 'Uma IA escolhe o produto ou monta o setup, e eu testo na prática se ela acertou. O público opina nos comentários.',
    tone: 'bg-mint',
  },
  {
    title: 'Review rápido',
    text: 'Até 30 segundos, só com os melhores pontos, e link ou cupom no final.',
    tone: 'bg-butter',
  },
  {
    title: 'Link direto na DM',
    text: 'Quem comenta uma palavra-chave recebe o link do produto na DM, de forma automática. Também vale nos stories.',
    tone: 'bg-sky',
  },
]

/** "2026-10-06" -> "06/10" (a data já vem fechada no dia certo; não passa por fuso). */
const dayKey = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`

function updatedLabel(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function SectionHead({ index, label, right }: { index: string; label: string; right?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
      <span className="label text-accent">
        {index} · {label}
      </span>
      {right && <span className="label">{right}</span>}
    </div>
  )
}

function BigStat({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className={`${tone} border border-ink rounded-[22px] p-5 shadow-[3px_3px_0_#1E1C19] break-inside-avoid`}>
      <div className="font-serif text-[clamp(38px,5.5vw,54px)] leading-none tracking-[-0.02em]">{value}</div>
      <div className="text-[14px] text-ink-2 mt-2 leading-snug">{label}</div>
    </div>
  )
}

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-surface border border-line rounded-[20px] p-4 sm:p-5 break-inside-avoid">
      <div className="font-serif text-[clamp(30px,4vw,40px)] leading-none">{value}</div>
      <div className="text-[13.5px] text-muted mt-2 leading-snug">{label}</div>
    </div>
  )
}

function ReachChart({ daily }: { daily: MediaKitData['dailyReach'] }) {
  const max = Math.max(...daily.map((d) => d.value))
  if (!(max > 0)) return null
  // Os 4 dias mais fortes ganham a cor de destaque, como no PDF.
  const peaks = new Set([...daily].sort((a, b) => b.value - a.value).slice(0, 4).map((d) => d.date))
  const ticks = [0, Math.floor((daily.length - 1) / 3), Math.floor(((daily.length - 1) * 2) / 3), daily.length - 1]

  return (
    <div className="mt-8 break-inside-avoid">
      <div className="flex items-baseline justify-between gap-3 flex-wrap text-[14px]">
        <span className="font-medium">Alcance diário · últimos 30 dias</span>
        <span className="text-muted">pico de {ptShort(max)} contas em um dia</span>
      </div>
      <div
        className="mt-3 h-36 sm:h-44 flex items-end gap-[3px]"
        role="img"
        aria-label={`Alcance diário dos últimos ${daily.length} dias, com pico de ${ptShort(max)} contas em um dia`}
      >
        {daily.map((d) => (
          <div
            key={d.date}
            title={`${dayKey(d.date)}: ${ptShort(d.value)} contas`}
            className={`flex-1 rounded-t-[4px] ${peaks.has(d.date) ? 'bg-accent' : 'bg-ink/15'}`}
            style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[11px] text-subtle mt-2">
        {ticks.map((i) => (
          <span key={i}>{daily[i] ? dayKey(daily[i].date) : ''}</span>
        ))}
      </div>
    </div>
  )
}

export default async function MediaKitPage() {
  const [site, kit, oslinke, topReels] = await Promise.all([
    getSiteSettings(),
    getMediaKitData(),
    getOslinkeData(),
    getTopReels(14, 4),
  ])
  const { socials, contact_email: contactEmail, avatar_url: avatarUrl } = site

  const instagram = socials.find((s) => s.name.toLowerCase() === 'instagram')
  const tiktok = socials.find((s) => s.name.toLowerCase() === 'tiktok')
  const followers = kit?.followers ?? oslinke.followers
  const instagramCount = followers !== null && followers !== undefined ? ptShort(followers) : instagram?.count ? kToMil(instagram.count) : null
  const tiktokCount = tiktok?.count ? kToMil(tiktok.count) : null

  const last30 = kit?.last30 ?? null
  const last60 = kit?.last60 ?? null
  const has60 = typeof last60?.views === 'number'
  const headViews = has60 ? last60!.views : (last30?.views ?? null)
  const win = has60 ? 60 : 30
  // Somas do período da manchete (60 dias quando há as duas janelas; senão 30).
  const period = has60 ? last60 : last30

  const tiles = [
    last30?.accountsEngaged != null && { value: ptShort(last30.accountsEngaged), label: 'contas interagiram com o conteúdo nos últimos 30 dias' },
    period?.interactions != null && { value: ptShort(period.interactions), label: `interações em ${win} dias: curtidas, comentários, salvamentos e envios` },
    last30?.netFollows != null && last30.netFollows > 0 && { value: `+${ptShort(last30.netFollows)}`, label: 'novos seguidores nos últimos 30 dias' },
    period?.saves != null && { value: ptShort(period.saves), label: `salvamentos em ${win} dias` },
    period?.shares != null && { value: ptShort(period.shares), label: `compartilhamentos em ${win} dias` },
    kit?.reels?.engagementPerPost != null && { value: ptPct(kit.reels.engagementPerPost), label: 'engajamento médio por post, sobre seguidores' },
  ].filter(Boolean) as { value: string; label: string }[]

  const reels = kit?.reels ?? null
  const top = reels?.top ?? []
  const reelsTitle =
    reels && reels.over200k >= 2
      ? `${reels.over200k} reels passaram de 200 mil visualizações`
      : reels && reels.over100k >= 2
        ? `${reels.over100k} reels passaram de 100 mil visualizações`
        : 'Os reels que mais rodaram'
  // Sem os números do Oslinke, cai pros mais vistos de 14 dias que a home já usa.
  const fallbackReels = (topReels.reels.length > 0 ? topReels.reels : oslinke.reels).filter((r) => r.views !== null)

  const audience = kit?.audience ?? null
  const brazil = audience?.countries.find((c) => c.key === 'BR')?.pct ?? null
  const adults = audience
    ? Math.round(audience.age.filter((a) => ['25-34', '35-44', '45-54'].includes(a.key)).reduce((s, a) => s + a.pct, 0))
    : null
  const men = audience?.gender.find((g) => g.key === 'M')?.pct ?? null
  const women = audience?.gender.find((g) => g.key === 'F')?.pct ?? null
  const ageMax = audience ? Math.max(...audience.age.map((a) => a.pct), 1) : 1

  const dm = kit?.oslinke && kit.oslinke.comments >= 100 ? kit.oslinke : null
  const updated = updatedLabel(kit?.updatedAt)
  const year = new Date().getFullYear()

  return (
    <>
      <PageReveal />
      <div className="contents print:hidden">
        <Header active="/media-kit" />
      </div>
      <main className="wrap max-w-[960px] py-12 sm:py-16 print:py-4">
        {/* 01 · Capa */}
        <section data-reveal className="flex flex-col-reverse sm:flex-row sm:items-end gap-6 mb-8">
          <div className="flex-1">
            <div className="label text-accent">Mídia kit · {year} · @heliofilhou</div>
            <h1 className="h-page mt-2">
              Hélio <em className="text-accent">Filho</em>
            </h1>
            <p className="text-ink-2 text-[17px] sm:text-[19px] leading-[1.45] mt-3 max-w-[580px]">{TAGLINE}</p>
            <p className="font-mono text-[12.5px] text-subtle mt-3">tech · IA · reviews</p>
          </div>
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-surface shadow-[0_0_0_1px_#E4DDD0] shrink-0">
            <MediaImg src={avatarUrl} alt="Hélio Filho" width={144} height={144} priority className="w-full h-full object-cover" />
          </div>
        </section>

        <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {instagramCount && <BigStat value={instagramCount} label="seguidores no Instagram" tone="bg-peach" />}
          {tiktokCount && <BigStat value={tiktokCount} label="seguidores no TikTok" tone="bg-lilac" />}
          {headViews != null && <BigStat value={ptShort(headViews)} label={`visualizações no Instagram em ${win} dias`} tone="bg-mint" />}
        </div>

        <div data-reveal className="flex flex-wrap gap-2.5 mb-14 print:hidden">
          <a
            href={`mailto:${contactEmail}?subject=Parceria`}
            className="px-4.5 py-2.5 rounded-full bg-ink text-surface hover:text-surface text-[14.5px] font-medium"
          >
            Falar sobre parceria →
          </a>
          <PrintButton className="px-4.5 py-2.5 rounded-full border border-ink bg-surface text-[14.5px] font-medium cursor-pointer hover:bg-chip" />
        </div>

        {/* 02 · Os números */}
        {headViews != null && (
          <section data-reveal className="mb-14">
            <SectionHead index="02" label="Os números" right={`Instagram · últimos ${win} dias`} />
            <h2 className="h-section">
              <span className="text-accent">{ptLong(headViews)}</span> de visualizações em {win} dias.
            </h2>
            {has60 && last30?.views != null && (
              <p className="text-muted text-[16px] mt-2">Só nos últimos 30, foram {ptLong(last30.views)}.</p>
            )}

            {tiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                {tiles.map((t) => (
                  <Tile key={t.label} value={t.value} label={t.label} />
                ))}
              </div>
            )}

            <div className="bg-butter border border-line rounded-[20px] p-4 sm:p-5 mt-3 text-[15px] leading-[1.55] text-ink-2 break-inside-avoid">
              Salvar e compartilhar são os sinais mais fortes de conteúdo útil: as pessoas guardam para usar depois e mandam para os
              amigos.
              {reels?.reelInteractionRate != null && (
                <>
                  {' '}
                  Nos reels, as interações equivalem a <strong className="text-ink">{ptPct(reels.reelInteractionRate)}</strong> do
                  alcance.
                </>
              )}
            </div>

            {kit && kit.dailyReach.length >= 7 && <ReachChart daily={kit.dailyReach} />}
          </section>
        )}

        {/* 03 · Vídeos que bombaram */}
        {top.length > 0 ? (
          <section data-reveal className="mb-14">
            <SectionHead index="03" label="Vídeos que bombaram" right="Reels · últimos 60 dias" />
            <h2 className="h-section">{reelsTitle}</h2>
            <p className="text-muted text-[15.5px] leading-[1.5] mt-2 max-w-[640px]">
              {reels && reels.over100k > 0 && <>Em 60 dias, {reels.over100k} vídeos passaram de 100 mil. </>}A fórmula é um assunto em
              alta, uma pergunta que prende e tecnologia explicada sem jargão.
            </p>
            <ol className="mt-5 border-t border-line">
              {top.map((r, i) => (
                <li key={r.id} className="border-b border-line break-inside-avoid">
                  <a
                    href={r.permalink ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 py-3.5 text-ink hover:text-ink group"
                  >
                    <span className={`font-mono text-[13px] w-6 shrink-0 ${i === 0 ? 'text-accent' : 'text-subtle'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="w-11 h-[60px] sm:w-12 sm:h-16 rounded-lg overflow-hidden bg-chip shrink-0 relative">
                      {r.thumbnailUrl && <MediaImg src={r.thumbnailUrl} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] sm:text-[15.5px] leading-snug font-medium group-hover:underline underline-offset-2">
                        {r.title || 'Reel'}
                      </div>
                      <div className="text-[12.5px] sm:text-[13px] text-muted mt-0.5">
                        {[
                          r.shares != null && `${ptShort(r.shares)} compartilhamentos`,
                          r.saves != null && `${ptShort(r.saves)} salvamentos`,
                          ptDay(r.timestamp),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-serif text-[24px] sm:text-[30px] leading-none">{ptShort(r.views)}</div>
                      <div className="text-[11.5px] text-muted mt-1">visualizações</div>
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          fallbackReels.length > 0 && (
            <section data-reveal className="mb-14">
              <SectionHead index="03" label="Vídeos que bombaram" right="Reels · últimos 14 dias" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {fallbackReels.map((r) => (
                  <a
                    key={r.id}
                    href={r.permalink ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-ink hover:text-ink bg-surface border border-ink rounded-2xl overflow-hidden shadow-[3px_3px_0_#1E1C19]"
                  >
                    <div className="aspect-[9/14] bg-chip relative overflow-hidden">
                      {r.thumbnailUrl && <MediaImg src={r.thumbnailUrl} alt="" fill sizes="(min-width: 640px) 200px, 42vw" className="object-cover" />}
                      {r.views !== null && (
                        <span className="absolute bottom-2 left-2 font-mono text-[10px] bg-ink text-surface px-2 py-0.5 rounded-full whitespace-nowrap">
                          ▶ {compactCount(r.views)}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )
        )}

        {/* 04 · Público */}
        {audience && audience.age.length > 0 && (
          <section data-reveal className="mb-14 break-inside-avoid">
            <SectionHead index="04" label="Público" right="Seguidores do Instagram" />
            <h2 className="h-section">Quem assiste</h2>
            <div className="grid sm:grid-cols-2 gap-8 mt-5">
              <div>
                <div className="flex gap-8">
                  {brazil != null && (
                    <div>
                      <div className="font-serif text-[clamp(42px,6vw,60px)] leading-none text-accent">{ptPct(Math.round(brazil))}</div>
                      <div className="text-[13.5px] text-muted mt-1">no Brasil</div>
                    </div>
                  )}
                  {adults != null && adults > 0 && (
                    <div>
                      <div className="font-serif text-[clamp(42px,6vw,60px)] leading-none">{adults}%</div>
                      <div className="text-[13.5px] text-muted mt-1">entre 25 e 54 anos</div>
                    </div>
                  )}
                </div>
                {men != null && women != null && (
                  <p className="text-[15px] text-ink-2 leading-[1.55] mt-5">
                    Público adulto: {ptPct(Math.round(men))} homens e {ptPct(Math.round(women))} mulheres.
                  </p>
                )}
                {audience.cities.length > 0 && (
                  <p className="text-[15px] text-ink-2 leading-[1.55] mt-3">
                    <strong className="text-ink">Maiores cidades:</strong> {audience.cities.join(', ')}.
                  </p>
                )}
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-muted mb-3">Seguidores por idade</div>
                <div className="flex flex-col gap-2.5">
                  {audience.age.map((a) => (
                    <div key={a.key} className="grid grid-cols-[48px_1fr_52px] items-center gap-3 text-[13.5px]">
                      <span className="font-mono text-[12px] text-ink-2">{a.key.replace('-', '–')}</span>
                      <span className="h-2.5 rounded-full bg-chip overflow-hidden">
                        <span
                          className={`block h-full rounded-full ${['25-34', '35-44', '45-54'].includes(a.key) ? 'bg-accent' : 'bg-ink/30'}`}
                          style={{ width: `${(a.pct / ageMax) * 100}%` }}
                        />
                      </span>
                      <span className="text-right text-ink-2">{ptPct(a.pct)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 05 · DM que dá para medir (só aparece com volume que impressione) */}
        {dm && (
          <section data-reveal className="mb-14 break-inside-avoid">
            <SectionHead index="05" label="Link na DM" right="Últimos 30 dias" />
            <h2 className="h-section">O público age quando eu peço</h2>
            <p className="text-muted text-[15.5px] leading-[1.5] mt-2 max-w-[660px]">
              Quem comenta a palavra-chave recebe o link na DM na hora, pela automação que eu mesmo programei. Os links passam por um contador
              próprio, então a marca recebe o número real de cliques, não uma estimativa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <Tile value={ptShort(dm.comments)} label="pedidos de link por comentário ou story" />
              <Tile value={ptShort(dm.dms)} label="DMs com o link entregues" />
              {dm.clicks > 0 && <Tile value={ptShort(dm.clicks)} label="cliques nos links da bio e das DMs" />}
            </div>
          </section>
        )}

        {/* Como a marca entra */}
        <section data-reveal className="mb-14">
          <SectionHead index={dm ? '06' : '05'} label="Formatos" />
          <h2 className="h-section">Como a sua marca entra</h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {FORMATS.map((f) => (
              <div key={f.title} className={`${f.tone} border border-line rounded-[20px] p-5 break-inside-avoid`}>
                <h3 className="h-block">{f.title}</h3>
                <p className="text-[14.5px] text-ink-2 leading-[1.55] mt-2">{f.text}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[14.5px] leading-[1.55] mt-4 max-w-[640px]">
            Toda publi sai marcada como parceria paga. Sem pacote fechado: você conta o que quer comunicar e eu mando ideias sob medida.
          </p>
        </section>

        <section
          data-reveal
          className="bg-peach border border-ink rounded-[24px] p-6 sm:p-8 shadow-[4px_4px_0_#1E1C19] flex flex-col sm:flex-row sm:items-end gap-5 justify-between break-inside-avoid"
        >
          <div>
            <h2 className="h-section">Vamos criar juntos?</h2>
            <p className="text-ink-2 text-[15.5px] mt-2">Mando ideias sob medida para a sua campanha.</p>
            <a
              href={`mailto:${contactEmail}?subject=Parceria`}
              className="inline-block mt-4 px-4.5 py-2.5 rounded-full bg-ink text-surface hover:text-surface text-[14.5px] font-medium print:hidden"
            >
              Falar sobre parceria →
            </a>
          </div>
          <div className="text-[15px] leading-[1.7] sm:text-right">
            <a href={`mailto:${contactEmail}`} className="block font-medium text-ink">
              {contactEmail}
            </a>
            <a href="https://www.instagram.com/heliofilhou/" className="block text-ink-2">
              @heliofilhou
            </a>
            <a href="https://links.heliofilho.dev" className="block text-ink-2">
              links.heliofilho.dev
            </a>
          </div>
        </section>

        {updated && (
          <p className="text-[12.5px] text-subtle mt-6">
            Fonte: Instagram Insights do @heliofilhou, pela API oficial. Atualizado em {updated}. TikTok: número do perfil público.
          </p>
        )}
      </main>
      <div className="contents print:hidden">
        <Footer />
      </div>
    </>
  )
}
