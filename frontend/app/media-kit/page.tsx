import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import MediaImg from '@/components/MediaImg'
import { getProjects } from '@/lib/content'
import { compactCount, getOslinkeData, getTopReels } from '@/lib/oslinke'
import { getSiteSettings } from '@/lib/settings'
import { toneClass } from '@/lib/socials'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Mídia Kit | helio*filho*.dev',
  description: 'Conteúdo sobre tecnologia, IA e carreira para devs e estudantes de tecnologia no Brasil. Integrações em vídeo e newsletter.',
}

function StatCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone: string }) {
  return (
    <div className={`${toneClass[tone]} rounded-[22px] p-5 flex flex-col gap-1`}>
      <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-2">{label}</span>
      <span className="font-serif text-[clamp(30px,4vw,40px)] leading-none">{value}</span>
      {sub && <span className="text-[13px] text-ink-2">{sub}</span>}
    </div>
  )
}

export default async function MediaKitPage() {
  const [site, oslinke, topReels, projects] = await Promise.all([
    getSiteSettings(),
    getOslinkeData(),
    getTopReels(14, 4),
    getProjects(),
  ])
  const { socials, contact_email: contactEmail, avatar_url: avatarUrl, bio } = site

  const instagram = socials.find((s) => s.name.toLowerCase() === 'instagram')
  const tiktok = socials.find((s) => s.name.toLowerCase() === 'tiktok')
  const instagramCount = oslinke.followers !== null ? compactCount(oslinke.followers) : instagram?.count
  // Os mais virais dos últimos 14 dias puxam o número que impressiona; se a janela vier vazia
  // (pouco tempo de dado sincronizado ainda), cai pros mais recentes em vez de sumir com a seção.
  const liveReels = (topReels.reels.length > 0 ? topReels.reels : oslinke.reels).filter((r) => r.views !== null)
  const bestViews = liveReels.length > 0 ? Math.max(...liveReels.map((r) => r.views ?? 0)) : null
  const noAr = projects.filter((p) => p.status === 'No ar').slice(0, 4)

  return (
    <>
      <PageReveal />
      <Header active="/media-kit" />
      <main className="wrap max-w-[920px] py-12 sm:py-16">
        <div data-reveal className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 text-center sm:text-left mb-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-surface shadow-[0_0_0_1px_#E4DDD0] shrink-0">
            <MediaImg src={avatarUrl} alt="Hélio Filho" width={96} height={96} priority className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="label text-accent">Mídia Kit</div>
            <h1 className="font-serif text-[clamp(34px,5.5vw,56px)] leading-[.98] tracking-[-0.02em] mt-1.5">
              Hélio <em className="text-accent">Filho</em>
            </h1>
            <p className="text-muted text-[15px] sm:text-base leading-[1.5] mt-2 max-w-[520px]">{bio}</p>
          </div>
        </div>

        <div data-reveal className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {instagramCount && <StatCard label="Instagram" value={instagramCount} sub={instagram?.handle} tone="peach" />}
          {tiktok?.count && <StatCard label="TikTok" value={tiktok.count} sub={tiktok.handle} tone="lilac" />}
          <StatCard label="Conteúdo" value="Tec · IA" sub="e carreira" tone="mint" />
          <StatCard label="Audiência" value="Devs" sub="e estudantes de tecnologia" tone="sky" />
        </div>

        {liveReels.length > 0 && (
          <section data-reveal className="mb-10">
            <h2 className="h-section mb-1">Mais virais dos últimos 14 dias</h2>
            <p className="text-muted text-[14.5px] mb-4">
              {bestViews !== null && (
                <>
                  O melhor Reel do período bateu <strong className="text-ink">{compactCount(bestViews)} visualizações</strong>.{' '}
                </>
              )}
              Alcance real, puxado direto do Instagram - atualiza sozinho.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {liveReels.map((r) => (
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
        )}

        {noAr.length > 0 && (
          <section data-reveal className="mb-10">
            <h2 className="h-section mb-4">O que eu construo</h2>
            <p className="text-muted text-[14.5px] mb-4">Não é só conteúdo: cada projeto no ar é usado de verdade.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {noAr.map((p) => (
                <div key={p.slug} className="bg-surface border border-line rounded-2xl p-4">
                  <div className="font-serif text-[19px]">{p.name}</div>
                  <p className="text-muted text-[14px] leading-[1.5] mt-1">{p.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section data-reveal className="bg-peach border border-ink rounded-[24px] p-6 sm:p-8 shadow-[4px_4px_0_#1E1C19]">
          <h2 className="h-block" style={{ color: '#8A5A3E' }}>
            Como funciona uma parceria
          </h2>
          <ul className="text-[#5E4A3E] text-[14.5px] leading-[1.5] mt-3 flex flex-col gap-1.5 list-disc pl-5">
            <li>Reel dedicado ou menção integrada a um vídeo já planejado</li>
            <li>Bloco na newsletter de sexta</li>
            <li>Formato combinado entre os dois</li>
          </ul>
          <p className="text-[#5E4A3E] text-[15px] leading-[1.6] mt-3 max-w-[560px]">
            Sempre deixando claro pra audiência o que é conteúdo pago. Conta o que você quer comunicar e eu volto com um
            formato que faça sentido - sem modelo fechado, sem tabela de preço fixa.
          </p>
          <a
            href={`mailto:${contactEmail}?subject=Parceria`}
            className="inline-block mt-4 px-4.5 py-2.5 rounded-full bg-ink text-surface hover:text-surface text-[14.5px] font-medium"
          >
            Falar sobre parceria →
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}
