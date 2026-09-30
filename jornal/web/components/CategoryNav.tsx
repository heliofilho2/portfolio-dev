import Link from 'next/link'

const ALL = 'Tudo'

function href(cat: string, trend: boolean) {
  const params = new URLSearchParams()
  if (cat !== ALL) params.set('cat', cat)
  if (trend) params.set('trend', '1')
  const qs = params.toString()
  return qs ? `/?${qs}` : '/'
}

export default function CategoryNav({ available, activeCat, onlyTrending }: { available: string[]; activeCat: string; onlyTrending: boolean }) {
  return (
    <nav className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:flex-wrap sm:justify-center overflow-x-auto no-scrollbar border-b border-ink py-2">
      {[ALL, ...available].map((c) => {
        const active = activeCat === c
        return (
          <Link
            key={c}
            href={href(c, onlyTrending)}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-1 border-r border-ink font-mono text-[12px] sm:text-[13px] tracking-[0.14em] uppercase no-underline transition-colors hover:text-red ${
              active ? 'text-red underline underline-offset-[5px]' : 'text-ink'
            }`}
          >
            {c}
          </Link>
        )
      })}
      <Link
        href={href(activeCat, !onlyTrending)}
        className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-1 font-mono text-[12px] sm:text-[13px] tracking-[0.14em] uppercase text-red no-underline ${
          onlyTrending ? 'underline underline-offset-[5px]' : ''
        }`}
      >
        ● Só em alta
      </Link>
    </nav>
  )
}
