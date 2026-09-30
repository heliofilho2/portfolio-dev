import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import MediaImg from '@/components/MediaImg'
import { getSiteSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Sobre | helio*filho*.dev',
  description: 'Dev full-stack que cria conteúdo sobre tecnologia, IA e carreira.',
}

export const revalidate = 300

// Cores dos cartões do "Agora", na ordem.
const nowColors = [
  { bg: 'bg-lilac', color: '#4F46C8' },
  { bg: 'bg-butter', color: '#7A6420' },
  { bg: 'bg-mint', color: '#3E6A4E' },
  { bg: 'bg-peach', color: '#8A5A3E' },
]

export default async function SobrePage() {
  const site = await getSiteSettings()
  const paragraphs = site.about_text.split(/\n\s*\n/).filter((p) => p.trim())

  return (
    <>
      <PageReveal />
      <Header active="/sobre" />
      <main className="wrap py-10 sm:py-14 pb-16 grid gap-8 lg:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div data-reveal className="lg:sticky lg:top-24 self-start max-w-[260px] sm:max-w-[320px] lg:max-w-none">
          <div className="rounded-[26px] lg:rounded-[30px] overflow-hidden aspect-[4/5] bg-mint">
            <MediaImg src={site.about_photo_url} alt="Hélio Filho" width={440} height={550} sizes="(min-width: 1024px) 440px, 320px" className="w-full h-full object-cover block" />
          </div>
          {site.about_location && <div className="label mt-3">{site.about_location}</div>}
        </div>

        <div data-reveal className="min-w-0">
          <div className="label text-accent">Sobre</div>
          <h1 className="h-page mt-2.5 mb-5">
            De programador a <em className="text-accent">criador</em>, sem largar o código.
          </h1>
          <div className="text-base sm:text-[17px] leading-[1.7] text-ink-2 flex flex-col gap-4 max-w-[580px]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {site.about_now.length > 0 && (
            <>
              <h2 className="h-sub mt-10 mb-3.5">Agora</h2>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {site.about_now.map((n, i) => {
                  const c = nowColors[i % nowColors.length]
                  return (
                    <div key={`${n.label}-${i}`} className={`${c.bg} rounded-2xl p-4`}>
                      <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase" style={{ color: c.color }}>
                        {n.label}
                      </div>
                      <div className="font-medium mt-1.5 text-[15px] leading-snug">{n.text}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {site.about_timeline.length > 0 && (
            <>
              <h2 className="h-sub mt-10 mb-1.5">Trajetória</h2>
              <div className="flex flex-col">
                {site.about_timeline.map((t, i) => (
                  <div key={`${t.role}-${i}`} className="grid gap-x-5 gap-y-1 py-3.5 border-t border-line sm:grid-cols-[110px_minmax(0,1fr)]">
                    <span className="font-mono text-xs text-subtle sm:pt-0.5">{t.when}</span>
                    <span>
                      <span className="block font-semibold text-[15.5px]">{t.role}</span>
                      {t.desc && <span className="block text-muted text-[14.5px] mt-0.5">{t.desc}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {site.about_stack.length > 0 && (
            <>
              <h2 className="h-sub mt-10 mb-3.5">Stack do dia a dia</h2>
              <div className="flex gap-2 flex-wrap">
                {site.about_stack.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full border border-line bg-surface text-[13.5px]">
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
