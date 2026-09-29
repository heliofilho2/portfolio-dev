import type { ProjectDto } from '@/lib/api'
import ArchitectureSnapshot from './ArchitectureSnapshot'

type JsonItem = string | Record<string, unknown>

// Os campos de case study são JSON salvo como texto; texto solto vira item único
function parseJsonArray(value?: string): JsonItem[] {
  if (!value?.trim()) return []
  try {
    const parsed: unknown = JSON.parse(value.trim())
    if (Array.isArray(parsed)) return parsed as JsonItem[]
    if (parsed && typeof parsed === 'object') return [parsed as Record<string, unknown>]
  } catch {}
  return [value]
}

function pick(item: JsonItem, ...keys: string[]): string {
  if (typeof item === 'string') return keys.length ? item : ''
  for (const key of keys) {
    const v = item[key]
    if (typeof v === 'string' && v) return v
  }
  return ''
}

export default function ProjectCaseStudy({ project }: { project: ProjectDto }) {
  const steps = parseJsonArray(project.technicalSolution).map((item) => ({
    step: typeof item === 'string' ? item : pick(item, 'step', 'description'),
    tool: typeof item === 'string' ? '' : pick(item, 'tool'),
  }))

  const decisions = parseJsonArray(project.technicalDecisions)
    .map((item) => ({
      title: typeof item === 'string' ? item : pick(item, 'decision', 'question'),
      body: typeof item === 'string' ? '' : pick(item, 'reason', 'answer'),
    }))
    .filter((d) => d.title || d.body)

  const tradeOffs = parseJsonArray(project.tradeOffs)
    .map((item) => ({
      title: typeof item === 'string' ? item : pick(item, 'decision', 'tradeOff'),
      body: typeof item === 'string' ? '' : pick(item, 'tradeoff', 'impact'),
    }))
    .filter((t) => t.title || t.body)

  return (
    <div className="space-y-12">
      {project.businessProblem && (
        <section>
          <h2 className="section-title">Problema de negócio</h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {project.businessProblem.trim()}
          </p>
        </section>
      )}

      {steps.length > 0 && (
        <section>
          <h2 className="section-title">Solução técnica</h2>
          <ol className="space-y-4">
            {steps.map((s, index) => (
              <li key={index} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-accent-soft text-accent text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{s.step}</p>
                  {s.tool && <p className="text-xs font-mono text-stone-400 mt-1">{s.tool}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {project.architectureNotes && <ArchitectureSnapshot architectureNotes={project.architectureNotes} />}

      {decisions.length > 0 && (
        <section>
          <h2 className="section-title">Decisões técnicas</h2>
          <div className="grid gap-3">
            {decisions.map((d, index) => (
              <div key={index} className="card p-5">
                <h3 className="font-bold tracking-tight mb-1.5">{d.title}</h3>
                {d.body && <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{d.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {tradeOffs.length > 0 && (
        <section>
          <h2 className="section-title">Trade-offs</h2>
          <div className="grid gap-3">
            {tradeOffs.map((t, index) => (
              <div key={index} className="card p-5 border-l-4 border-l-accent/50">
                <h3 className="font-bold tracking-tight mb-1.5">{t.title}</h3>
                {t.body && <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{t.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
