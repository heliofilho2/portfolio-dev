import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Em manutenção | helio*filho*.dev',
  description: 'O site está temporariamente em manutenção. Voltaremos em breve.',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-bg">
      <div className="w-full max-w-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border border-line bg-surface text-muted mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-prio-alta/60 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-prio-alta" />
          </span>
          Em manutenção
        </div>

        <h1 className="font-serif text-5xl md:text-6xl mb-6">Voltamos já.</h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">Estamos aplicando melhorias no site. Volta em breve com novidades.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="mailto:heliofilho.contato@outlook.com"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ink text-surface text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Enviar e-mail
          </a>
          <a
            href="https://www.linkedin.com/in/heliofilhoo/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-line text-ink text-sm font-medium hover:border-ink transition-colors w-full sm:w-auto"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/heliofilho2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-line text-ink text-sm font-medium hover:border-ink transition-colors w-full sm:w-auto"
          >
            GitHub
          </a>
        </div>

        <div className="mt-16 text-xs font-mono text-subtle">heliofilho.dev</div>
      </div>
    </main>
  )
}
