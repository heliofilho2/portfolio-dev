import { supabase } from './supabase'
import { devRead, devStoreOn } from './devStore'

// Conteúdo do site (posts, cofre, projetos, diário e configurações) mora no Supabase,
// nas tabelas de supabase/content.sql, e é editado pelo /admin. Sem Supabase configurado
// (dev ou build local com CONTENT_SEED=1) lê do armazenamento local em lib/devStore.ts.

export * from './contentModel'
import type { CofreItem, Post, Project, ProjectUpdate } from './contentModel'

const byDateDesc = <T extends { published_at: string }>(a: T, b: T) => b.published_at.localeCompare(a.published_at)
const isPublished = (x: { published?: boolean }) => x.published !== false

// "No ar" primeiro, sempre - dentro de cada status, respeita a ordem manual (sort).
const statusWeight: Record<Project['status'], number> = { 'No ar': 0, 'Em construção': 1, Ideia: 2 }
const byLiveFirst = (a: Project, b: Project) => statusWeight[a.status] - statusWeight[b.status] || a.sort - b.sort

async function query<T>(label: string, run: () => PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<T[]> {
  const { data, error } = await run()
  if (error) {
    console.error(`[${label}]`, error.message)
    return []
  }
  return (data as T[]) ?? []
}

export async function getCofreItems(): Promise<CofreItem[]> {
  if (devStoreOn) return (await devRead()).cofre.filter(isPublished).sort(byDateDesc)
  if (!supabase) return []
  return query('cofre', () => supabase!.from('cofre_items').select('*').eq('published', true).order('published_at', { ascending: false }))
}

export async function getCofreItem(slug: string): Promise<CofreItem | null> {
  return (await getCofreItems()).find((c) => c.slug === slug) ?? null
}

export async function getProjects(): Promise<Project[]> {
  if (devStoreOn) return (await devRead()).projects.filter(isPublished).sort(byLiveFirst)
  if (!supabase) return []
  const rows = await query<Project>('projetos', () => supabase!.from('site_projects').select('*').eq('published', true).order('sort'))
  return rows.sort(byLiveFirst)
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null
}

export async function getProjectUpdates(slug: string): Promise<ProjectUpdate[]> {
  if (devStoreOn) return (await devRead()).updates.filter((u) => u.project_slug === slug).sort(byDateDesc)
  if (!supabase) return []
  return query('diario', () => supabase!.from('project_updates').select('*').eq('project_slug', slug).order('published_at', { ascending: false }))
}

export async function getPosts(): Promise<Post[]> {
  if (devStoreOn) return (await devRead()).posts.filter((p) => p.published).sort(byDateDesc)
  if (!supabase) return []
  return query('posts', () => supabase!.from('posts').select('*').eq('published', true).order('published_at', { ascending: false }))
}

export async function getPost(slug: string): Promise<Post | null> {
  return (await getPosts()).find((p) => p.slug === slug) ?? null
}
