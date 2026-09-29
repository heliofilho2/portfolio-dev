import { intro, resumes, socials } from '@/lib/hub'
import { DownloadIcon, MailIcon, WhatsappIcon, socialIcons } from '@/components/icons'

export default function Footer() {
  return (
    <footer id="contato" className="border-t border-line scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Vamos conversar</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-6 max-w-xl">
          Aberto a projetos de consultoria em .NET e SAP Business One, parcerias de conteúdo e novas oportunidades.
        </p>
        <div className="flex flex-wrap gap-2 mb-10">
          <a
            href={`mailto:${intro.email}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-surface-light dark:text-background-dark text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <MailIcon className="w-4 h-4" />
            E-mail
          </a>
          <a
            href={intro.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-link inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
          >
            <WhatsappIcon className="w-4 h-4" />
            WhatsApp
          </a>
          {resumes.map((resume) => (
            <a
              key={resume.href}
              href={resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-link inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
            >
              <DownloadIcon className="w-4 h-4" />
              {resume.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-400">
          <span>
            © {new Date().getFullYear()} {intro.name} · {intro.location}
          </span>
          <div className="flex gap-3">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon]
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="hover:text-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
