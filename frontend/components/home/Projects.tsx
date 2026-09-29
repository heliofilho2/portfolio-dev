import Link from 'next/link'
import type { ProjectDto } from '@/lib/api'
import { ArrowIcon } from '@/components/icons'

export default function Projects({ projects }: { projects: ProjectDto[] }) {
  if (projects.length === 0) return null

  return (
    <section id="projetos" className="mb-16 scroll-mt-20">
      <h2 className="section-title">Projetos em produção</h2>
      <div className="grid gap-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="card card-link group p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight leading-snug">{project.title}</h3>
              </div>
              <ArrowIcon className="w-5 h-5 shrink-0 mt-1 text-stone-400 group-hover:text-accent transition-colors" />
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                [project.metric1Name, project.metric1Value],
                [project.metric2Name, project.metric2Value],
              ]
                .filter(([name, value]) => name && value)
                .map(([name, value]) => (
                  <div key={name} className="flex items-baseline gap-1.5">
                    <span className="font-bold text-accent">{value}</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{name}</span>
                  </div>
                ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
