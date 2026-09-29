'use client'

import { useMemo, useState } from 'react'
import { categories, topics } from '@/lib/taxonomy'
import NewsCard, { type NewsCardItem } from './NewsCard'

const ALL = 'Todos'

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-9 px-4 py-2 rounded-full border font-mono text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
        active ? 'bg-ink border-ink text-paper' : 'bg-card border-rule text-ink hover:border-teal'
      }`}
    >
      {label}
    </button>
  )
}

export default function NewsFeed({ items }: { items: NewsCardItem[] }) {
  const [filter, setFilter] = useState(ALL)

  // Só mostra tópicos que aparecem nas notícias da janela atual
  const availableTopics = useMemo(
    () => topics.filter((topic) => items.some((item) => item.topics.includes(topic))),
    [items]
  )

  const visible = filter === ALL ? items : items.filter((i) => i.category === filter || i.topics.includes(filter))
  const countLabel = `${visible.length} ${visible.length === 1 ? 'notícia' : 'notícias'}${filter === ALL ? '' : ` em "${filter}"`}`

  return (
    <section aria-label="Notícias">
      <div className="pt-6 flex flex-col gap-3">
        <div className="label">Categorias</div>
        <div className="flex flex-wrap gap-2">
          {[ALL, ...categories].map((c) => (
            <Chip key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />
          ))}
        </div>
      </div>

      {availableTopics.length > 0 && (
        <div className="pt-4 flex flex-col gap-3">
          <div className="label">Tópicos em destaque</div>
          <div className="flex flex-wrap gap-2">
            {availableTopics.map((t) => (
              <Chip key={t} label={t} active={filter === t} onClick={() => setFilter(filter === t ? ALL : t)} />
            ))}
          </div>
        </div>
      )}

      <p className="pt-8 pb-4 font-mono text-[13px] text-faint" aria-live="polite">
        {countLabel}
      </p>

      {visible.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5 pb-12">
          {visible.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="pb-12 text-muted">Nenhuma notícia nessa seleção nas últimas 48 horas.</p>
      )}
    </section>
  )
}
