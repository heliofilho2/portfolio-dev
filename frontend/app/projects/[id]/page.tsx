import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi'
import { SiGithub } from 'react-icons/si'
import { projectsApi } from '@/lib/api'
import ProjectCaseStudy from '@/components/projects/ProjectCaseStudy'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const revalidate = 300

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

async function getProject(id: string) {
  const projectId = Number.parseInt(id, 10)
  if (Number.isNaN(projectId)) return null
  return projectsApi.getById(projectId)
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject((await params).id)
  if (!project) return { title: 'Projeto não encontrado | Helio Filho' }

  const description = (project.businessProblem || project.description).trim().substring(0, 160)
  return {
    title: `${project.title} | Estudo de caso | Helio Filho`,
    description,
    openGraph: { title: `${project.title} | Estudo de caso`, description, type: 'article' },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject((await params).id)
  if (!project) notFound()

  const metrics = [
    [project.metric1Name, project.metric1Value],
    [project.metric2Name, project.metric2Value],
  ].filter((m): m is [string, string] => Boolean(m[0] && m[1]))

  const tags = project.tags?.split(',').map((tag) => tag.trim()).filter(Boolean) ?? []

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16">
        <Link
          href="/#projetos"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-accent transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          Voltar para projetos
        </Link>

        <span className="block text-xs font-mono uppercase tracking-wider text-accent mb-2">
          {project.category} · Estudo de caso
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed mb-6">{project.description}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(project.gitHubUrl || project.demoUrl) && (
          <div className="flex flex-wrap gap-2 mb-10">
            {project.gitHubUrl && (
              <a
                href={project.gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-link inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                <SiGithub className="w-4 h-4" />
                Código no GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-link inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                <FiExternalLink className="w-4 h-4" />
                Ver demo
              </a>
            )}
          </div>
        )}

        {metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-12">
            {metrics.map(([name, value]) => (
              <div key={name} className="card p-5">
                <div className="text-3xl font-bold tracking-tight text-accent">{value}</div>
                <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">{name}</div>
              </div>
            ))}
          </div>
        )}

        <ProjectCaseStudy project={project} />
      </main>
      <Footer />
    </>
  )
}
