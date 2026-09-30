import type { Metadata } from 'next'
import { Geist_Mono, Instrument_Serif, Libre_Caslon_Text } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
})

const libreCaslon = Libre_Caslon_Text({
  subsets: ['latin'],
  variable: '--font-libre-caslon',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jornal.heliofilho.dev'),
  title: 'O Jornal Tech',
  description: 'Tudo que importa em tecnologia, e nada do que não importa.',
  openGraph: {
    title: 'O Jornal Tech',
    description: 'Tudo que importa em tecnologia, e nada do que não importa.',
    url: 'https://jornal.heliofilho.dev',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${instrumentSerif.variable} ${libreCaslon.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
