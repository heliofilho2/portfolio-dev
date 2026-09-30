import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import NewsletterForm from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Newsletter | helio*filho*.dev',
  description: 'A carta do Hélio: o melhor da semana no jornal, o bastidor dos vídeos e o material novo do cofre.',
}

const parts = [
  { title: 'Resumo do jornal', text: 'As notícias que importaram, com contexto.', bg: 'bg-lilac', color: '#4A4466' },
  { title: 'Bastidor', text: 'O que deu errado no vídeo da semana.', bg: 'bg-peach', color: '#5E4A3E' },
  { title: 'Do cofre', text: 'O achado novo da semana.', bg: 'bg-mint', color: '#3E5A48' },
]

// TODO: "edições anteriores" precisa de um histórico real assim que a newsletter começar a sair.
export default function NewsletterPage() {
  return (
    <>
      <PageReveal />
      <Header active="/newsletter" />
      <main className="wrap max-w-[840px] py-12 sm:py-16">
        <div data-reveal className="text-center">
          <div className="label text-accent">Newsletter · toda sexta, 7h</div>
          <h1 className="font-serif text-[clamp(46px,7vw,82px)] leading-[.92] tracking-[-0.03em] mt-3 mb-4">
            A carta do <em className="text-accent">Hélio</em>
          </h1>
          <p className="text-base sm:text-[17px] leading-[1.55] text-muted max-w-[520px] mx-auto mb-7">
            O melhor da semana no jornal, o bastidor dos vídeos e o material novo do cofre. Cinco minutos de leitura.
          </p>
          <div className="max-w-[480px] mx-auto">
            <NewsletterForm variant="block" ctaLabel="Assinar grátis" />
          </div>
          <div className="font-mono text-[11.5px] text-subtle mt-3">sem spam · sai com 1 clique</div>
        </div>

        <div data-reveal className="grid gap-2.5 sm:grid-cols-3 mt-12">
          {parts.map((p) => (
            <div key={p.title} className={`${p.bg} rounded-[20px] p-5`}>
              <div className="font-serif text-[23px]">{p.title}</div>
              <div className="text-[14.5px] mt-1 leading-normal" style={{ color: p.color }}>
                {p.text}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
