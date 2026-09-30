import type { CofreItem, Post, Project } from './contentModel'

// Modelos vazios pros editores do /admin ("novo post", "nova página do cofre", "novo projeto").

export const blankPost = (): Post => ({
  slug: '',
  title: '',
  summary: '',
  cover_url: null,
  body_md: '',
  tags: [],
  published: false,
  published_at: new Date().toISOString(),
})

export const blankCofre = (): CofreItem => ({
  slug: '',
  category: 'Vídeos',
  topic: null,
  title: '',
  summary: '',
  body_md: '',
  tone: 'rose',
  cover_url: null,
  video_url: null,
  keyword: null,
  materials: [],
  chapters: [],
  published: false,
  published_at: new Date().toISOString(),
})

export const blankProject = (sort: number): Project => ({
  slug: '',
  name: '',
  type: 'Produto',
  status: 'Em construção',
  year: String(new Date().getFullYear()),
  stack: '',
  summary: '',
  url: null,
  repo_url: null,
  tone: 'lilac',
  cover_url: null,
  problem: null,
  solution: null,
  arch: [],
  decisions: [],
  tradeoffs: [],
  readme_md: '',
  sort,
  published: false,
})
