import Link from 'next/link'
import { initialOf, isNew, toneBg, type CofreItem } from '@/lib/content'

const fold = { background: 'linear-gradient(225deg,#F6F3EC 0 50%,#E9E2D4 50%)', boxShadow: '-1px 1px 2px rgba(30,28,25,.08)' }
const cardBase =
  'relative text-ink hover:text-ink bg-surface border border-line rounded-tr-[4px] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-22px_rgba(30,28,25,.4)]'

const NewBadge = () => <span className="font-mono text-[9.5px] tracking-[0.12em] px-1.5 py-0.5 rounded-full bg-prio-alta text-surface">NOVO</span>

// Card do cofre. "row" = versão da home (horizontal); "tile" = grade do /cofre.
export default function CofreCard({ item: c, variant = 'tile' }: { item: CofreItem; variant?: 'row' | 'tile' }) {
  const fresh = isNew(c.published_at)

  if (variant === 'row') {
    return (
      <Link href={`/cofre/${c.slug}`} className={`${cardBase} flex gap-4 items-center px-4 sm:px-5 py-4 rounded-2xl`}>
        <span className="absolute -top-px -right-px w-5 h-5 rounded-bl-[4px]" style={fold} />
        <span className={`w-11 h-11 rounded-full shrink-0 ${toneBg[c.tone]} flex items-center justify-center font-serif italic text-xl`}>{initialOf(c.title)}</span>
        <span className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="flex gap-2 items-center flex-wrap">
            <span className="font-serif text-[21px] leading-[1.1]">{c.title}</span>
            {fresh && <NewBadge />}
          </span>
          <span className="text-muted text-sm leading-snug line-clamp-2">{c.summary}</span>
        </span>
        <span className="text-base text-subtle">→</span>
      </Link>
    )
  }

  return (
    <Link href={`/cofre/${c.slug}`} className={`${cardBase} flex flex-col gap-3.5 p-5 rounded-[20px]`}>
      <span className="absolute -top-px -right-px w-6 h-6 rounded-bl-[4px]" style={fold} />
      <span className="flex justify-between items-center gap-3 pr-5">
        <span className={`w-11 h-11 rounded-full ${toneBg[c.tone]} flex items-center justify-center font-serif italic text-[22px]`}>{initialOf(c.title)}</span>
        <span className="flex gap-1.5 items-center min-w-0">
          {fresh && <NewBadge />}
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-subtle truncate">{c.topic ?? c.category}</span>
        </span>
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-serif text-[24px] leading-[1.08]">{c.title}</span>
        <span className="text-muted text-[14.5px] leading-normal">{c.summary}</span>
      </span>
      <span className="mt-auto text-[13.5px] font-medium text-accent">
        {c.category === 'Vídeos' ? 'Ver página do vídeo →' : 'Abrir →'}
      </span>
    </Link>
  )
}
