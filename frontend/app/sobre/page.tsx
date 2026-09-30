import type { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'

export const metadata: Metadata = {
  title: 'Sobre | helio*filho*.dev',
  description: 'Dev full-stack que cria conteúdo sobre tecnologia, IA e carreira.',
}

const now = [
  { label: 'Construindo', text: 'O Jornal Tech e este site', bg: 'bg-lilac', color: '#4F46C8' },
  { label: 'Postando', text: 'Tecnologia, IA e dinheiro no Instagram', bg: 'bg-butter', color: '#7A6420' },
  { label: 'Trabalhando', text: '.NET para SAP Business One', bg: 'bg-mint', color: '#3E6A4E' },
]

const timeline = [
  { when: 'desde 2026', role: 'Desenvolvedor .NET · RAMO BH', desc: 'Desenvolvimento .NET para SAP Business One.' },
  { when: '2025 a 2026', role: 'Desenvolvedor SAP Business One · SAASAgro', desc: 'Desenvolvimento e integrações com o SAP Business One.' },
  { when: '2021 a 2025', role: 'Analista de Sistemas SAP Business One · PrimeInterway', desc: 'Análise e desenvolvimento no SAP Business One.' },
  { when: '2021', role: 'Estágio em Integração de Dados · Prefeitura de Itajubá', desc: 'O primeiro emprego na área.' },
]

const stack = ['C#', '.NET', 'SAP Business One', 'TypeScript', 'Next.js', 'Supabase', 'Claude Code']

export default function SobrePage() {
  return (
    <>
      <PageReveal />
      <Header active="/sobre" />
      <main className="wrap py-10 sm:py-14 pb-16 grid gap-8 lg:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div data-reveal className="lg:sticky lg:top-24 self-start max-w-[260px] sm:max-w-[320px] lg:max-w-none">
          <div className="rounded-[26px] lg:rounded-[30px] overflow-hidden aspect-[4/5] bg-mint">
            <Image src="/helio.jpg" alt="Hélio Filho" width={440} height={550} className="w-full h-full object-cover block" />
          </div>
          <div className="label mt-3">Itajubá, MG</div>
        </div>

        <div data-reveal className="min-w-0">
          <div className="label text-accent">Sobre</div>
          <h1 className="h-page mt-2.5 mb-5">
            De programador a <em className="text-accent">criador</em>, sem largar o código.
          </h1>
          <div className="text-base sm:text-[17px] leading-[1.7] text-ink-2 flex flex-col gap-4 max-w-[580px]">
            <p>
              Sou dev há mais de 5 anos e, nas horas vagas, construo meus próprios apps com IA. No Instagram eu falo de tecnologia, IA e dinheiro, e
              aqui eu guardo tudo: projetos, materiais e um jornal tech.
            </p>
          </div>

          <h2 className="h-sub mt-10 mb-3.5">Agora</h2>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {now.map((n) => (
              <div key={n.label} className={`${n.bg} rounded-2xl p-4`}>
                <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase" style={{ color: n.color }}>
                  {n.label}
                </div>
                <div className="font-medium mt-1.5 text-[15px] leading-snug">{n.text}</div>
              </div>
            ))}
          </div>

          <h2 className="h-sub mt-10 mb-1.5">Trajetória</h2>
          <div className="flex flex-col">
            {timeline.map((t) => (
              <div key={t.role} className="grid gap-x-5 gap-y-1 py-3.5 border-t border-line sm:grid-cols-[110px_minmax(0,1fr)]">
                <span className="font-mono text-xs text-subtle sm:pt-0.5">{t.when}</span>
                <span>
                  <span className="block font-semibold text-[15.5px]">{t.role}</span>
                  <span className="block text-muted text-[14.5px] mt-0.5">{t.desc}</span>
                </span>
              </div>
            ))}
          </div>

          <h2 className="h-sub mt-10 mb-3.5">Stack do dia a dia</h2>
          <div className="flex gap-2 flex-wrap">
            {stack.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full border border-line bg-surface text-[13.5px]">
                {s}
              </span>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
