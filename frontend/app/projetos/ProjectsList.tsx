'use client'

import { useMemo, useState } from 'react'
import ProjectRow from '@/components/ProjectRow'
import type { Project } from '@/lib/contentModel'

const ALL = 'Tudo'

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const types = useMemo(() => [ALL, ...new Set(projects.map((p) => p.type))], [projects])
  const [filter, setFilter] = useState(ALL)
  const filtered = filter === ALL ? projects : projects.filter((p) => p.type === filter)

  return (
    <>
      <div data-reveal className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-1.5 overflow-x-auto no-scrollbar my-5">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13.5px] font-medium transition-colors cursor-pointer ${
              filter === t ? 'bg-ink text-surface' : 'bg-chip text-muted hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map((p, i) => (
          <ProjectRow key={p.slug} project={p} n={i + 1} size="lg" />
        ))}
        {filtered.length === 0 && <p className="text-muted py-8">Nenhum projeto com esse filtro.</p>}
      </div>
    </>
  )
}
