import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { supabase } from './supabase'
import { seedCofre, seedProjects, seedUpdates } from './contentSeed'
import type { CofreItem, Post, Project, ProjectUpdate } from './contentModel'
import type { SiteSettings } from './settingsModel'

// Armazenamento local pra testar o site e o /admin sem Supabase: um JSON em .dev-content/
// (fora do git), começando com o conteúdo de lib/contentSeed.ts. Nunca usado em produção.
export const devStoreOn = !supabase && (process.env.NODE_ENV === 'development' || process.env.CONTENT_SEED === '1')

export const devDir = path.join(process.cwd(), '.dev-content')
export const devMediaDir = path.join(devDir, 'media')
const file = path.join(devDir, 'content.json')

export interface DevDb {
  cofre: CofreItem[]
  projects: Project[]
  updates: ProjectUpdate[]
  posts: Post[]
  settings: Partial<SiteSettings>
}

const initial = (): DevDb => ({
  cofre: seedCofre.map((c) => ({ ...c, published: true })),
  projects: seedProjects.map((p) => ({ ...p, published: true })),
  updates: [...seedUpdates],
  posts: [],
  settings: {},
})

export async function devRead(): Promise<DevDb> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as DevDb
  } catch {
    return initial()
  }
}

export async function devWrite(db: DevDb) {
  await mkdir(devDir, { recursive: true })
  await writeFile(file, JSON.stringify(db, null, 2))
}
