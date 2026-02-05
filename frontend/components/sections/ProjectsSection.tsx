'use client'

/**
 * Seção de Projetos/Deployments
 * * Baseado no HTML fornecido:
 * - Grid de cards com projetos
 * - Métricas de impacto
 * - Tags de tecnologias
 * - Ícones Material Symbols
 * * FUTURO: Buscar dados da API
 */

import { useState, useEffect } from 'react'
import { projectsApi, type ProjectDto } from '@/lib/api'

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const data = await projectsApi.getAll().catch(() => []) // Se falhar, retorna array vazio
        // Garantir que data seja sempre um array
        setProjects(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
        console.error('Error fetching projects:', err)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Dados vêm 100% do backend - sem fallback

  if (loading) {
    return (
      <div className="mb-12" id="projects">
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12" id="projects">
      {/* Cabeçalho */}
      <div className="flex items-end justify-between mb-6 border-l-4 border-accent pl-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Deployment & Impact Metrics</h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">
            Quantifiable results from technical implementations
          </p>
        </div>
        <div className="flex gap-2">
          <div className="metric-card !p-2 flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">KPI: Manual Operational Effort</span>
            <span className="text-xs font-black text-emerald-500">-85%</span>
          </div>
        </div>
      </div>

      {/* Grid de Projetos */}
      {error && projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            Erro ao carregar projetos. Verifique se o backend está rodando.
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Nenhum projeto cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
          <div key={project.id} className="metric-card group flex flex-col h-full">
            {/* Cabeçalho do Card */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-tighter">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold leading-tight group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
              </div>
              {/* Ícone - usando SVGs próprios para não depender de fonte externa */}
              {project.icon === 'hub' && (
                <svg
                  className="w-5 h-5 text-slate-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="6" cy="12" r="2" strokeWidth="2" />
                  <circle cx="18" cy="7" r="2" strokeWidth="2" />
                  <circle cx="18" cy="17" r="2" strokeWidth="2" />
                  <path d="M8 12h6.5M16.5 8.5L13 11M16.5 15.5L13 13" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              {project.icon === 'monitoring' && (
                <svg
                  className="w-5 h-5 text-slate-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="4" width="18" height="12" rx="2" ry="2" strokeWidth="2" />
                  <path
                    d="M7 13l3-4 3 3 3-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M9 20h6" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              {project.icon === 'terminal' && (
                <svg
                  className="w-5 h-5 text-slate-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="4" width="18" height="14" rx="2" ry="2" strokeWidth="2" />
                  <path d="M7 9l3 3-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>

            {/* Descrição */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-grow">
              {project.description}
            </p>

            {/* Métricas */}
            {(project.metric1Name || project.metric2Name) && (
              <div className="grid grid-cols-2 gap-2 mt-auto">
                {project.metric1Name && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      {project.metric1Name}
                    </div>
                    <div className="text-lg font-black text-emerald-500">
                      {project.metric1Value}
                    </div>
                  </div>
                )}
                {project.metric2Name && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      {project.metric2Name}
                    </div>
                    <div className="text-lg font-black">{project.metric2Value}</div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {project.tags && (
              <div className="mt-4 flex flex-wrap gap-1">
                {project.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-bold rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  )
}