import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/projetos', label: 'Projetos' },
  { href: '/cofre', label: 'Cofre' },
  { href: '/blog', label: 'Blog' },
  { href: '/newsletter', label: 'Newsletter' },
]

// Desktop: logo · nav · CTA numa linha, como no protótipo.
// Celular: logo + CTA em cima, nav embaixo numa faixa que rola na horizontal.
export default function Header({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-20 bg-bg/86 backdrop-blur-md border-b border-line">
      <div className="wrap py-2.5 lg:py-3 flex items-center gap-x-5 gap-y-1.5 flex-wrap lg:flex-nowrap">
        <Link href="/" className="font-serif text-[23px] lg:text-[25px] leading-none tracking-[-0.01em] text-ink hover:text-ink">
          helio<em className="text-accent">filho</em>.dev
        </Link>
        <nav className="order-last lg:order-none w-full lg:w-auto lg:ml-auto -mx-1 lg:mx-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-0.5 items-center w-max">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-colors hover:text-ink ${
                  active === item.href ? 'bg-chip text-ink' : 'text-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://jornal.heliofilho.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full text-[13.5px] font-medium text-muted whitespace-nowrap flex gap-1.5 items-center hover:text-ink"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-prio-alta" />
              Jornal ↗
            </a>
          </div>
        </nav>
        <Link
          href="/newsletter"
          className="ml-auto lg:ml-0 whitespace-nowrap px-3.5 lg:px-4 py-2 rounded-full bg-ink text-surface hover:text-surface text-[13px] lg:text-[13.5px] font-medium transition-transform hover:-translate-y-px"
        >
          <span className="hidden sm:inline">Assinar newsletter</span>
          <span className="sm:hidden">Assinar</span>
        </Link>
      </div>
    </header>
  )
}
