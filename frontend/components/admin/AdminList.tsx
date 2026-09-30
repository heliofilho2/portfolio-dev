'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toneBg, type Tone } from '@/lib/contentModel'
import { StatusPill } from './fields'
import { btn } from './ui'

export interface ListRow {
  key: string
  href: string
  title: string
  meta: string
  published: boolean
  initial: string
  tone: Tone
  thumb?: string | null
}

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export default function AdminList({ title, rows, newHref, newLabel, empty }: { title: string; rows: ListRow[]; newHref: string; newLabel: string; empty: string }) {
  const [q, setQ] = useState('')
  const [only, setOnly] = useState<'all' | 'pub' | 'draft'>('all')
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) => (only === 'all' || (only === 'pub' ? r.published : !r.published)) && (!q || normalize(`${r.title} ${r.meta}`).includes(normalize(q)))
      ),
    [rows, q, only]
  )
  const chip = (v: typeof only, label: string) => (
    <button type="button" onClick={() => setOnly(v)} className={`shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer ${only === v ? 'bg-ink text-surface' : 'bg-chip text-muted hover:text-ink'}`}>
      {label}
    </button>
  )

  return (
    <div>
      <div className="flex justify-between items-end gap-3 flex-wrap mb-5">
        <div>
          <h1 className="font-serif text-[clamp(34px,4.5vw,44px)] leading-none">{title}</h1>
          <p className="text-[13.5px] text-subtle mt-1.5">
            {rows.length} {rows.length === 1 ? 'item' : 'itens'} · {rows.filter((r) => !r.published).length} rascunho(s)
          </p>
        </div>
        <Link href={newHref} className={btn.primary}>
          + {newLabel}
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap items-center mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar…"
          className="w-full sm:w-64 rounded-full border border-line bg-surface px-4 py-2 text-base sm:text-sm outline-none focus:border-ink"
        />
        <div className="flex gap-1.5">
          {chip('all', 'Todos')}
          {chip('pub', 'Publicados')}
          {chip('draft', 'Rascunhos')}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-line py-14 text-center text-subtle">{rows.length ? 'Nada com esse filtro.' : empty}</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((r) => (
            <Link
              key={r.key}
              href={r.href}
              className="flex items-center gap-3.5 px-3.5 py-3 bg-surface border border-line rounded-2xl text-ink hover:text-ink hover:border-ink transition-colors"
            >
              {r.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.thumb} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 bg-chip" />
              ) : (
                <span className={`w-12 h-12 rounded-xl ${toneBg[r.tone]} flex items-center justify-center font-serif italic text-[22px] shrink-0`}>{r.initial}</span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-[15.5px] truncate">{r.title}</span>
                <span className="block text-[12.5px] text-subtle truncate">{r.meta}</span>
              </span>
              <StatusPill published={r.published} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
