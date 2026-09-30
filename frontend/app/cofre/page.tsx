import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import CofreGrid from './CofreGrid'
import { getCofreItems } from '@/lib/content'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Cofre | helio*filho*.dev',
  description: 'Repos, livros, equipamento e a página de cada vídeo. Sem e-mail, sem cadastro.',
}

export default async function CofrePage() {
  const items = await getCofreItems()

  return (
    <>
      <PageReveal />
      <Header active="/cofre" />
      <main className="wrap py-10 sm:py-14 pb-16">
        <div data-reveal className="text-center max-w-[640px] mx-auto mb-8">
          <div className="label text-accent">Cofre do Hélio</div>
          <h1 className="font-serif text-[clamp(48px,7vw,84px)] leading-[.92] tracking-[-0.03em] mt-2.5 mb-4">
            O <em className="text-accent">cofre</em>
          </h1>
          <p className="text-base sm:text-[17px] text-muted leading-[1.55]">
            Tudo que eu uso e mostro nos vídeos: repos, livros, equipamento e a página completa de cada vídeo. Sem e-mail, sem cadastro.
          </p>
        </div>
        <CofreGrid items={items} />
      </main>
      <Footer />
    </>
  )
}
