/**
 * Página Individual de Projeto (Case Study)
 * 
 * Server Component para melhor SEO e performance.
 * Busca dados do projeto via API e renderiza case study completo.
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projectsApi, type ProjectDto } from '@/lib/api'
import ProjectCaseStudy from '@/components/projects/ProjectCaseStudy'
import Header from '@/components/layout/Header'

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Gera metadata dinâmica para SEO
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    return {
      title: 'Project Not Found | Helio Filho',
    };
  }

  try {
    const project = await projectsApi.getById(projectId);
    
    if (!project) {
      return {
        title: 'Project Not Found | Helio Filho',
      };
    }

    const description = project.businessProblem 
      ? project.businessProblem.substring(0, 160)
      : project.description.substring(0, 160);

    return {
      title: `${project.title} | Case Study | Helio Filho`,
      description: description,
      openGraph: {
        title: `${project.title} | Case Study`,
        description: description,
        type: 'article',
      },
    };
  } catch (error) {
    return {
      title: 'Project Not Found | Helio Filho',
    };
  }
}

/**
 * Componente da página
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  let project: ProjectDto | null = null;
  try {
    project = await projectsApi.getById(projectId);
  } catch (error) {
    console.error('Error fetching project:', error);
  }

  if (!project) {
    notFound();
  }

  // Helper para pegar githubUrl (pode vir como gitHubUrl ou githubUrl)
  const githubUrl = (project as any).gitHubUrl || (project as any).githubUrl || project.githubUrl;
  const demoUrl = (project as any).demoUrl || project.demoUrl;

  // Debug: verificar campos (remover depois)
  if (process.env.NODE_ENV === 'development') {
    console.log('Project data:', {
      id: project.id,
      title: project.title,
      githubUrl: githubUrl,
      githubUrlType: typeof githubUrl,
      githubUrlTruthy: !!githubUrl,
      hasGithubUrl: githubUrl != null && githubUrl !== '',
      allKeys: Object.keys(project),
      projectRaw: project,
    });
  }

  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-6 max-w-[1600px] mx-auto">
        {/* Header do Projeto */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-accent uppercase tracking-tighter">
                {project.category}
              </span>
              <h1 className="text-4xl font-black mt-2 mb-4">{project.title}</h1>
            </div>
            {/* Links externos */}
            <div className="flex gap-3">
              {githubUrl && githubUrl.trim() !== '' && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-accent transition-colors"
                  aria-label="GitHub Repository"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {demoUrl && demoUrl.trim() !== '' && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-accent transition-colors"
                  aria-label="Live Demo"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
          {/* Tags */}
          {project.tags && (
            <div className="flex flex-wrap gap-2">
              {project.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded border border-slate-200 dark:border-slate-700"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Case Study */}
        <ProjectCaseStudy project={project} />
      </main>
    </>
  );
}
