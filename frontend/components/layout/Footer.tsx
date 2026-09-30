import { socials } from '@/lib/socials'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap pt-10 pb-8 flex justify-between items-end gap-5 flex-wrap">
        <div className="font-serif text-[clamp(44px,7vw,88px)] leading-[.85] tracking-[-0.03em]">
          helio<em className="text-accent">filho</em>.dev
        </div>
        <div className="flex flex-col gap-2 sm:items-end font-mono text-[11.5px] text-subtle">
          <div className="flex gap-x-4 gap-y-1 flex-wrap">
            {socials.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-subtle hover:text-ink">
                {s.name}
              </a>
            ))}
          </div>
          <span>© {new Date().getFullYear()} · feito com Next.js</span>
        </div>
      </div>
    </footer>
  )
}
