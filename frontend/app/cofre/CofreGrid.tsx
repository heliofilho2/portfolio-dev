'use client'

import { useMemo, useState } from 'react'
import CofreCard from '@/components/CofreCard'
import { cofreCategories, type CofreItem } from '@/lib/contentModel'

const ALL = 'Tudo'

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export default function CofreGrid({ items }: { items: CofreItem[] }) {
  const [filter, setFilter] = useState(ALL)
  const [q, setQ] = useState('')

  // Só mostra as categorias que têm item publicado.
  const filters = useMemo(() => [ALL, ...cofreCategories.filter((c) => items.some((i) => i.category === c))], [items])

  const filtered = useMemo(() => {
    const ql = normalize(q.trim())
    return items.filter(
      (c) => (filter === ALL || c.category === filter) && (!ql || normalize([c.title, c.summary, c.topic ?? '', c.keyword ?? ''].join(' ')).includes(ql))
    )
  }, [items, filter, q])

  return (
    <>
      <div data-reveal className="flex gap-3 flex-wrap items-center justify-between py-3 border-t border-b border-line mb-5">
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-1.5 overflow-x-auto no-scrollbar max-w-[calc(100%+32px)] sm:max-w-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13.5px] font-medium transition-colors cursor-pointer ${
                filter === f ? 'bg-ink text-surface' : 'bg-chip text-muted hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar no cofre…"
          aria-label="Buscar no cofre"
          className="w-full sm:w-60 px-4 py-2 rounded-full border border-line bg-surface outline-none focus:border-ink text-[15px] sm:text-sm"
        />
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CofreCard key={c.slug} item={c} />
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-subtle">Nada por aqui com esse filtro.</div>}
    </>
  )
}
