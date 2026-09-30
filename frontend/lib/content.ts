import { supabase } from './supabase'
import { seedCofre, seedProjects, seedUpdates } from './contentSeed'

// Conteúdo do site (cofre, projetos e diário dos projetos) mora no Supabase, nas tabelas
// criadas por supabase/content.sql. Publicar = inserir/editar uma linha, sem deploy.
// Sem Supabase configurado, em dev (ou com CONTENT_SEED=1 num build local), usa o conteúdo
// inicial de lib/contentSeed.ts.

export const tones = ['lilac', 'mint', 'peach', 'butter', 'sky', 'rose'] as const
export type Tone = (typeof tones)[number]

export const cofreCategories = ['Vídeos', 'Repos', 'Produtos', 'Livros', 'Guias'] as const
export type CofreCategory = (typeof cofreCategories)[number]

export interface Material {
  label: string
  sub?: string
  url?: string
}

export interface Chapter {
  t: string
  label: string
}

export interface CofreItem {
  slug: string
  category: CofreCategory
  topic: string | null
  title: string
  summary: string
  body_md: string
  tone: Tone
  video_url: string | null
  keyword: string | null
  materials: Material[]
  chapters: Chapter[]
  published_at: string
}

export type ProjectStatus = 'No ar' | 'Em construção' | 'Ideia'

export interface Project {
  slug: string
  name: string
  type: string
  status: ProjectStatus
  year: string | null
  stack: string
  summary: string
  url: string | null
  repo_url: string | null
  tone: Tone
  problem: string | null
  solution: string | null
  arch: string[]
  decisions: string[]
  tradeoffs: string[]
  readme_md: string
  sort: number
}

export interface ProjectUpdate {
  id: number
  project_slug: string
  title: string
  body_md: string
  published_at: string
}

const useSeed = !supabase && (process.env.NODE_ENV === 'development' || process.env.CONTENT_SEED === '1')

export const statusBg: Record<ProjectStatus, string> = {
  'No ar': 'bg-mint',
  'Em construção': 'bg-butter',
  Ideia: 'bg-chip',
}

export const toneBg: Record<Tone, string> = {
  lilac: 'bg-lilac',
  mint: 'bg-mint',
  peach: 'bg-peach',
  butter: 'bg-butter',
  sky: 'bg-sky',
  rose: 'bg-rose',
}

// Inicial do ícone, pulando artigo ("O Jornal Tech" → J).
export const initialOf = (s: string) => s.trim().replace(/^(o|a|os|as|the)\s+/i, '').charAt(0).toUpperCase()

// "Novo" = publicado nos últimos 7 dias.
export const isNew = (iso: string) => Date.now() - new Date(iso).getTime() < 7 * 24 * 3600 * 1000

const byDateDesc = <T extends { published_at: string }>(a: T, b: T) => b.published_at.localeCompare(a.published_at)

export async function getCofreItems(): Promise<CofreItem[]> {
  if (useSeed) return [...seedCofre].sort(byDateDesc)
  if (!supabase) return []
  const { data, error } = await supabase.from('cofre_items').select('*').eq('published', true).order('published_at', { ascending: false })
  if (error) {
    console.error('[cofre]', error.message)
    return []
  }
  return data as CofreItem[]
}

export async function getCofreItem(slug: string): Promise<CofreItem | null> {
  if (useSeed) return seedCofre.find((c) => c.slug === slug) ?? null
  if (!supabase) return null
  const { data } = await supabase.from('cofre_items').select('*').eq('slug', slug).eq('published', true).maybeSingle()
  return (data as CofreItem) ?? null
}

export async function getProjects(): Promise<Project[]> {
  if (useSeed) return [...seedProjects].sort((a, b) => a.sort - b.sort)
  if (!supabase) return []
  const { data, error } = await supabase.from('site_projects').select('*').eq('published', true).order('sort')
  if (error) {
    console.error('[projetos]', error.message)
    return []
  }
  return data as Project[]
}

export async function getProject(slug: string): Promise<Project | null> {
  if (useSeed) return seedProjects.find((p) => p.slug === slug) ?? null
  if (!supabase) return null
  const { data } = await supabase.from('site_projects').select('*').eq('slug', slug).eq('published', true).maybeSingle()
  return (data as Project) ?? null
}

export async function getProjectUpdates(slug: string): Promise<ProjectUpdate[]> {
  if (useSeed) return seedUpdates.filter((u) => u.project_slug === slug).sort(byDateDesc)
  if (!supabase) return []
  const { data } = await supabase.from('project_updates').select('*').eq('project_slug', slug).order('published_at', { ascending: false })
  return (data as ProjectUpdate[]) ?? []
}
