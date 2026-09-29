import { categoryStyle } from '@/lib/taxonomy'
import type { EditionItem } from '@/lib/news'

export type NewsCardItem = EditionItem

export default function NewsCard({ item }: { item: NewsCardItem }) {
  const style = categoryStyle[item.category] ?? categoryStyle.Outro
  const isHigh = item.priority === 'alta'

  return (
    <article
      className={`bg-card border border-card-line rounded-[4px] p-6 flex flex-col gap-3 border-l-[3px] ${
        isHigh ? 'border-l-rust' : 'border-l-rule'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`shrink-0 w-10 h-10 rounded-[4px] flex items-center justify-center font-mono text-xs font-semibold ${style.className}`}
        >
          {style.initials}
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">{item.category}</span>
            {item.trending && (
              <span className="font-mono text-[11px] tracking-[0.04em] font-semibold text-rust">● EM ALTA</span>
            )}
            {isHigh && <span className="sr-only">Prioridade alta</span>}
          </div>
          <h3 className="text-[19px] leading-snug font-semibold">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-teal">
              {item.title_pt}
            </a>
          </h3>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-ink-2">{item.summary_pt}</p>

      {item.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.topics.map((topic) => (
            <span key={topic} className="font-mono text-[11px] text-muted bg-paper-2 rounded-[3px] px-2 py-0.5">
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#EFEBDD]">
        <span className="font-mono text-xs text-muted">{item.source}</span>
        <time dateTime={item.published_at} className="font-mono text-xs text-faint">
          {item.timeLabel}
        </time>
      </div>
    </article>
  )
}
