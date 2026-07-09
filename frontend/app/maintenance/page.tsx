import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Em manutenção | Helio Filho',
  description: 'O site está temporariamente em manutenção. Voltaremos em breve.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MaintenancePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var stored = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mono-text border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            STATUS: MAINTENANCE
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
            Em manutenção
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Estamos aplicando melhorias no portfólio.
            <br className="hidden md:block" />
            Voltamos em breve com novidades.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="metric-card text-left">
              <div className="text-xs mono-text text-slate-500 dark:text-slate-500 mb-1">
                STATUS
              </div>
              <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Em atualização
              </div>
            </div>
            <div className="metric-card text-left">
              <div className="text-xs mono-text text-slate-500 dark:text-slate-500 mb-1">
                PREVISÃO
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Em breve
              </div>
            </div>
            <div className="metric-card text-left">
              <div className="text-xs mono-text text-slate-500 dark:text-slate-500 mb-1">
                CONTATO
              </div>
              <div className="text-sm font-semibold text-accent">
                Disponível
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:heliofilho.contato@outlook.com"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors w-full sm:w-auto"
            >
              Enviar e-mail
            </a>
            <a
              href="https://www.linkedin.com/in/heliofilhoo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:border-accent hover:text-accent transition-colors w-full sm:w-auto"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/heliofilho2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:border-accent hover:text-accent transition-colors w-full sm:w-auto"
            >
              GitHub
            </a>
          </div>

          <div className="mt-16 text-xs mono-text text-slate-400 dark:text-slate-600">
            heliofilho.dev
          </div>
        </div>
      </main>
    </>
  )
}
