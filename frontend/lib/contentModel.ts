// Tipos, constantes e helpers do conteúdo. Sem acesso a dados: seguro pra componentes client.

export const tones = ['lilac', 'mint', 'peach', 'butter', 'sky', 'rose'] as const
export type Tone = (typeof tones)[number]

export const cofreCategories = ['Vídeos', 'Repos', 'Produtos', 'Livros', 'Guias'] as const
export type CofreCategory = (typeof cofreCategories)[number]

export const projectStatuses = ['No ar', 'Em construção', 'Ideia'] as const
export type ProjectStatus = (typeof projectStatuses)[number]

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
  cover_url?: string | null
  video_url: string | null
  keyword: string | null
  materials: Material[]
  chapters: Chapter[]
  published?: boolean
  published_at: string
}

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
  cover_url?: string | null
  problem: string | null
  solution: string | null
  arch: string[]
  decisions: string[]
  tradeoffs: string[]
  readme_md: string
  sort: number
  published?: boolean
}

export interface ProjectUpdate {
  id: number
  project_slug: string
  title: string
  body_md: string
  published_at: string
}

export interface Post {
  slug: string
  title: string
  summary: string
  cover_url: string | null
  body_md: string
  tags: string[]
  published: boolean
  published_at: string
}

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

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date(iso))
