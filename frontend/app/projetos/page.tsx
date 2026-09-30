import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageReveal from '@/components/PageReveal'
import ProjectsList from './ProjectsList'
import { getProjects } from '@/lib/content'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Projetos | helio*filho*.dev',
  description: 'O que estou construindo: no ar, em obra e na gaveta.',
}

export default async function ProjetosPage() {
  const projects = await getProjects()

  return (
    <>
      <PageReveal />
      <Header active="/projetos" />
      <main className="wrap py-10 sm:py-14 pb-16">
        <div data-reveal className="flex justify-between items-end gap-4 flex-wrap pb-6 border-b border-line">
          <div>
            <div className="label text-accent">Projetos pessoais</div>
            <h1 className="h-page mt-2.5">
              No ar, em obra <em className="text-accent">e na gaveta.</em>
            </h1>
          </div>
          <div className="font-mono text-xs text-subtle">{projects.length} projetos</div>
        </div>
        <ProjectsList projects={projects} />
      </main>
      <Footer />
    </>
  )
}
