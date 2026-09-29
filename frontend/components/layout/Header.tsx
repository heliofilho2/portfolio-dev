import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/#produtos', label: 'Produtos' },
  { href: '/#conteudo', label: 'Conteúdo' },
  { href: '/#projetos', label: 'Projetos' },
  { href: '/#sobre', label: 'Sobre' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold tracking-tight shrink-0">
          helio<span className="text-accent">filho</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2.5 py-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-ink whitespace-nowrap transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
