import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['400', '600', '700'],
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  weight: ['400', '500', '600'],
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jornal.heliofilho.dev'),
  title: 'SINAL — Jornal de Tecnologia e IA',
  description:
    'IA, tecnologia e engenharia de software, sem sensacionalismo. Uma seleção diária com fonte sempre citada, por @heliofilhou.',
  openGraph: {
    title: 'SINAL — Jornal de Tecnologia e IA',
    description: 'Uma seleção diária de IA e tecnologia, sem sensacionalismo.',
    url: 'https://jornal.heliofilho.dev',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${sourceSerif.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
