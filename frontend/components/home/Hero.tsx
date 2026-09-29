import Image from 'next/image'
import { intro, socials } from '@/lib/hub'
import { socialIcons } from '@/components/icons'

export default function Hero() {
  return (
    <section className="pt-12 sm:pt-16 pb-10">
      <Image
        src="/avatar.jpg"
        alt={intro.name}
        width={96}
        height={96}
        priority
        className="w-24 h-24 rounded-full object-cover ring-4 ring-surface-light dark:ring-surface-dark shadow-md mb-6"
      />
      <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-4">
        Oi, eu sou o {intro.name.split(' ')[0]}.
      </h1>
      <p className="text-lg sm:text-xl font-medium text-stone-700 dark:text-stone-300 mb-3">
        {intro.headline}
      </p>
      <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mb-8">{intro.bio}</p>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <a
          href={intro.newsletterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rust text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Assinar a newsletter
        </a>
        <a href="#produtos" className="text-sm font-medium text-accent hover:underline underline-offset-4">
          Ver produtos e projetos
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {socials.map((social) => {
          const Icon = socialIcons[social.icon]
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.name} ${social.handle}`}
              className="card card-link inline-flex items-center gap-2 px-3.5 py-2 text-sm"
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{social.name}</span>
              {social.followers && (
                <span className="font-mono text-xs text-accent font-bold">{social.followers}</span>
              )}
            </a>
          )
        })}
      </div>
    </section>
  )
}
