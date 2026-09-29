import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://heliofilho.dev'),
  title: 'Helio Filho | Desenvolvedor .NET, SAP B1 e criador de conteúdo',
  description:
    'Desenvolvedor .NET especializado em SAP Business One e integrações. Produtos, projetos, newsletter e conteúdo sobre tecnologia e IA.',
  keywords: ['desenvolvedor', '.NET', 'SAP B1', 'backend', 'portfólio', 'Planilio', 'IA'],
  openGraph: {
    title: 'Helio Filho',
    description: 'Desenvolvedor .NET, SAP Business One e criador de conteúdo sobre tecnologia e IA.',
    url: 'https://heliofilho.dev',
    locale: 'pt_BR',
    type: 'website',
    images: ['/avatar.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.ico', sizes: '64x64', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.ico',
  },
}

// Claro é o padrão; o escuro só entra se o visitante escolheu no toggle. Roda antes da pintura.
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${sourceSerif.variable} ${plexSans.variable} ${plexMono.variable} font-sans bg-background-light dark:bg-background-dark text-ink transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  )
}
