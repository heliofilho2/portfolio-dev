import type { Metadata } from 'next'
import { Caveat, Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  weight: ['400', '500', '600'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['400', '500'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['500', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://heliofilho.dev'),
  title: 'helio*filho*.dev',
  description:
    'Dev full-stack que cria conteúdo sobre tecnologia, IA e carreira. Projetos, materiais e um jornal tech: tudo mora aqui.',
  openGraph: {
    title: 'helio*filho*.dev',
    description: 'Dev full-stack que cria conteúdo sobre tecnologia, IA e carreira.',
    url: 'https://heliofilho.dev',
    locale: 'pt_BR',
    type: 'website',
    images: ['/helio.jpg'],
  },
  // Sem ícone custom por enquanto (o antigo era o mascote). O navegador usa o ícone genérico
  // até ter um novo arquivo pra colocar aqui.
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
