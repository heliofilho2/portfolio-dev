import Link from 'next/link'
import { initialOf, statusBg, toneBg, type Project } from '@/lib/content'

// Linha de projeto (home e /projetos). No celular some a numeração e o status desce pra linha do meio.
export default function ProjectRow({ project: p, n, size = 'md' }: { project: Project; n: number; size?: 'md' | 'lg' }) {
  const icon = size === 'lg' ? 'w-12 h-12 sm:w-15 sm:h-15 text-[28px] sm:text-[34px]' : 'w-12 h-12 sm:w-13 sm:h-13 text-[26px] sm:text-[30px]'
  return (
    <Link
      href={`/projetos/${p.slug}`}
      className="group grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[32px_auto_minmax(0,1fr)_auto] gap-x-4 sm:gap-x-5 items-center px-4 sm:px-5 py-3.5 sm:py-4 bg-surface border border-line rounded-2xl text-ink hover:text-ink transition-[transform,border-color] duration-300 hover:translate-x-1 hover:border-ink"
    >
      <span className="hidden sm:block font-mono text-xs text-subtle">{String(n).padStart(2, '0')}.</span>
      <span className={`${icon} rounded-2xl ${toneBg[p.tone]} flex items-center justify-center font-serif italic`}>{initialOf(p.name)}</span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold ${size === 'lg' ? 'text-[17px]' : 'text-base'}`}>{p.name}</span>
          <span className={`sm:hidden px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBg[p.status]}`}>{p.status}</span>
        </span>
        <span className="text-muted text-[14.5px] leading-snug line-clamp-2 sm:truncate">{p.summary}</span>
        {(p.stack || size === 'lg') && (
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-subtle truncate">
            {size === 'lg' ? [p.type, p.stack].filter(Boolean).join(' · ') : p.stack}
          </span>
        )}
      </span>
      <span className={`hidden sm:block px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${statusBg[p.status]}`}>{p.status}</span>
    </Link>
  )
}
