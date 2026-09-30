'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/admin/actions'

const items = [
  { href: '/admin', label: 'Painel', icon: '◎' },
  { href: '/admin/posts', label: 'Blog', icon: '✎' },
  { href: '/admin/cofre', label: 'Cofre', icon: '◇' },
  { href: '/admin/projetos', label: 'Projetos', icon: '▤' },
  { href: '/admin/site', label: 'Site', icon: '☰' },
  { href: '/admin/midia', label: 'Mídia', icon: '▣' },
]

export default function AdminNav() {
  const path = usePathname()
  const active = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href))

  return (
    <>
      {/* Desktop: barra lateral */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-56 flex-col border-r border-line bg-surface px-3 py-5">
        <Link href="/admin" className="px-3 font-serif text-[22px] leading-none text-ink hover:text-ink">
          helio<em className="text-accent">filho</em>
          <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-subtle mt-1.5">painel</span>
        </Link>
        <nav className="flex flex-col gap-0.5 mt-7">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[14.5px] font-medium transition-colors ${
                active(i.href) ? 'bg-chip text-ink' : 'text-muted hover:text-ink hover:bg-bg'
              }`}
            >
              <span className="w-4 text-center text-subtle">{i.icon}</span>
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-0.5">
          <a href="/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl text-[14px] text-muted hover:text-ink hover:bg-bg">
            Ver site ↗
          </a>
          <form action={logout}>
            <button type="submit" className="w-full text-left px-3 py-2 rounded-xl text-[14px] text-muted hover:text-ink hover:bg-bg cursor-pointer">
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Celular: topo + abas que rolam */}
      <header className="lg:hidden sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line">
        <div className="flex items-center justify-between px-4 pt-3">
          <Link href="/admin" className="font-serif text-[20px] leading-none text-ink hover:text-ink">
            helio<em className="text-accent">filho</em> <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-subtle">painel</span>
          </Link>
          <div className="flex items-center gap-3 text-[13px]">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-muted">
              Site ↗
            </a>
            <form action={logout}>
              <button type="submit" className="text-muted cursor-pointer">
                Sair
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto no-scrollbar px-3 py-2">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[13.5px] font-medium ${active(i.href) ? 'bg-ink text-surface' : 'text-muted'}`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  )
}
