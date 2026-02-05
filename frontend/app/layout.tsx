import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Helio Filho | Technical Dashboard Portfolio',
  description: 'Technical Lead / SAP B1 Specialist - Portfolio técnico com métricas e projetos',
  keywords: ['developer', 'SAP B1', 'backend', 'portfolio', 'technical lead'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    /* suppressHydrationWarning é vital para evitar erros de mismatch de tema no reload */
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} ${jetbrainsMono.variable} 
          font-sans 
          /* CORREÇÃO: Adicionadas classes dark: para o fundo e texto base */
          bg-background-light dark:bg-background-dark 
          text-slate-900 dark:text-slate-100 
          transition-colors duration-300
        `}
      >
        {children}
      </body>
    </html>
  )
}