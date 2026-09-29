import type { ExperienceDto } from '@/lib/api'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' })

export default function Experience({ experiences }: { experiences: ExperienceDto[] }) {
  if (experiences.length === 0) return null

  const sorted = [...experiences].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  return (
    <section id="experiencia" className="mb-16 scroll-mt-20">
      <h2 className="section-title">Experiência</h2>
      <ol className="relative border-l border-line ml-1.5 space-y-8">
        {sorted.map((exp) => (
          <li key={exp.id} className="pl-6 relative">
            <span
              className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${
                exp.isCurrent ? 'bg-accent' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
              <h3 className="font-bold tracking-tight">
                {exp.title}
                {exp.company && <span className="font-normal text-stone-500 dark:text-stone-400"> · {exp.company}</span>}
              </h3>
              <span className="text-xs font-mono text-stone-400 whitespace-nowrap">
                {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'atual'}
              </span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{exp.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
