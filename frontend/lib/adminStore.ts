import { mkdir, readdir, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { MEDIA_BUCKET, supabaseAdmin } from './supabaseAdmin'
import { devMediaDir, devRead, devStoreOn, devWrite } from './devStore'
import {
  cofreCategories,
  projectStatuses,
  slugify,
  tones,
  type CofreItem,
  type Post,
  type Project,
  type ProjectUpdate,
  type Tone,
} from './contentModel'
import { mergeSettings, type SiteSettings } from './settingsModel'

// Leitura completa (inclui rascunhos) e escrita do /admin. Só chamar depois de requireAdmin().
// Grava no Supabase com a service role; sem Supabase, no armazenamento local (lib/devStore.ts).

export type AdminMode = 'supabase' | 'local' | 'off'
export const adminMode: AdminMode = supabaseAdmin ? 'supabase' : devStoreOn ? 'local' : 'off'

export class AdminError extends Error {}

// ---------- normalização da entrada (tudo que vem do navegador passa por aqui) ----------

const str = (v: unknown, max = 20000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const optStr = (v: unknown, max = 2000) => str(v, max) || null
const strList = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 500)).filter(Boolean) : [])
const objList = <K extends string>(v: unknown, keys: K[]): Record<K, string>[] =>
  Array.isArray(v)
    ? v
        .map((o) => Object.fromEntries(keys.map((k) => [k, str((o as Record<string, unknown>)?.[k], 2000)])) as Record<K, string>)
        .filter((o) => keys.some((k) => o[k]))
    : []
const tone = (v: unknown): Tone => (tones.includes(v as Tone) ? (v as Tone) : 'lilac')
const date = (v: unknown) => {
  const d = new Date(typeof v === 'string' && v ? v : Date.now())
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function slugOf(v: unknown, fallback: string) {
  const s = slugify(str(v) || fallback)
  if (!s) throw new AdminError('Dê um título ou link pra essa página.')
  return s
}

function need(v: string, what: string) {
  if (!v) throw new AdminError(`Preencha ${what}.`)
  return v
}

export function normalizePost(i: Record<string, unknown>): Post {
  const title = need(str(i.title, 300), 'o título')
  return {
    slug: slugOf(i.slug, title),
    title,
    summary: str(i.summary, 600),
    cover_url: optStr(i.cover_url),
    body_md: str(i.body_md, 200000),
    tags: strList(i.tags),
    published: Boolean(i.published),
    published_at: date(i.published_at),
  }
}

export function normalizeCofre(i: Record<string, unknown>): CofreItem {
  const title = need(str(i.title, 300), 'o título')
  const category = cofreCategories.includes(i.category as CofreItem['category']) ? (i.category as CofreItem['category']) : 'Guias'
  return {
    slug: slugOf(i.slug, title),
    category,
    topic: optStr(i.topic, 120),
    title,
    summary: need(str(i.summary, 600), 'o resumo'),
    body_md: str(i.body_md, 200000),
    tone: tone(i.tone),
    cover_url: optStr(i.cover_url),
    video_url: optStr(i.video_url),
    keyword: optStr(i.keyword, 40)?.toUpperCase() ?? null,
    materials: objList(i.materials, ['label', 'sub', 'url']),
    chapters: objList(i.chapters, ['t', 'label']),
    published: Boolean(i.published),
    published_at: date(i.published_at),
  }
}

export function normalizeProject(i: Record<string, unknown>): Project {
  const name = need(str(i.name, 200), 'o nome')
  return {
    slug: slugOf(i.slug, name),
    name,
    type: str(i.type, 60) || 'Produto',
    status: projectStatuses.includes(i.status as Project['status']) ? (i.status as Project['status']) : 'Em construção',
    year: optStr(i.year, 10),
    stack: str(i.stack, 300),
    summary: need(str(i.summary, 600), 'o resumo'),
    url: optStr(i.url),
    repo_url: optStr(i.repo_url),
    tone: tone(i.tone),
    cover_url: optStr(i.cover_url),
    problem: optStr(i.problem, 5000),
    solution: optStr(i.solution, 5000),
    arch: strList(i.arch),
    decisions: strList(i.decisions),
    tradeoffs: strList(i.tradeoffs),
    readme_md: str(i.readme_md, 200000),
    sort: Number.isFinite(Number(i.sort)) ? Math.round(Number(i.sort)) : 0,
    published: Boolean(i.published),
  }
}

export function normalizeUpdate(i: Record<string, unknown>): Omit<ProjectUpdate, 'id'> & { id?: number } {
  return {
    ...(Number(i.id) > 0 ? { id: Number(i.id) } : {}),
    project_slug: need(str(i.project_slug, 100), 'o projeto'),
    title: need(str(i.title, 300), 'o título'),
    body_md: str(i.body_md, 100000),
    published_at: date(i.published_at),
  }
}

export function normalizeSettings(i: Record<string, unknown>): SiteSettings {
  const d = mergeSettings(null)
  return {
    avatar_url: str(i.avatar_url, 2000) || d.avatar_url,
    hand_note: str(i.hand_note, 80),
    bio: str(i.bio, 1000),
    contact_email: str(i.contact_email, 200) || d.contact_email,
    socials: objList(i.socials, ['name', 'handle', 'url', 'count', 'tone']).map((s) => ({ ...s, tone: tone(s.tone) })),
    reels: objList(i.reels, ['title', 'url', 'views', 'image_url', 'tone']).map((r) => ({ ...r, tone: tone(r.tone) })),
    about_photo_url: str(i.about_photo_url, 2000) || d.about_photo_url,
    about_location: str(i.about_location, 120),
    about_text: str(i.about_text, 5000),
    about_now: objList(i.about_now, ['label', 'text']),
    about_timeline: objList(i.about_timeline, ['when', 'role', 'desc']),
    about_stack: strList(i.about_stack),
  }
}

// ---------- leitura completa ----------

export interface AdminData {
  posts: Post[]
  cofre: CofreItem[]
  projects: Project[]
  updates: ProjectUpdate[]
  settings: SiteSettings
}

export async function loadAll(): Promise<AdminData> {
  if (adminMode === 'local') {
    const db = await devRead()
    return { posts: db.posts, cofre: db.cofre, projects: db.projects, updates: db.updates, settings: mergeSettings(db.settings) }
  }
  if (!supabaseAdmin) return { posts: [], cofre: [], projects: [], updates: [], settings: mergeSettings(null) }
  const [posts, cofre, projects, updates, settings] = await Promise.all([
    supabaseAdmin.from('posts').select('*').order('published_at', { ascending: false }),
    supabaseAdmin.from('cofre_items').select('*').order('published_at', { ascending: false }),
    supabaseAdmin.from('site_projects').select('*').order('sort'),
    supabaseAdmin.from('project_updates').select('*').order('published_at', { ascending: false }),
    supabaseAdmin.from('site_settings').select('data').eq('id', 'main').maybeSingle(),
  ])
  const failed = [posts, cofre, projects, updates].find((r) => r.error)
  if (failed?.error) throw new AdminError(`Supabase: ${failed.error.message}. Rodou o supabase/content.sql?`)
  return {
    posts: (posts.data as Post[]) ?? [],
    cofre: (cofre.data as CofreItem[]) ?? [],
    projects: (projects.data as Project[]) ?? [],
    updates: (updates.data as ProjectUpdate[]) ?? [],
    settings: mergeSettings(settings.data?.data as Partial<SiteSettings> | undefined),
  }
}

// ---------- escrita genérica por slug ----------

type Table = 'posts' | 'cofre_items' | 'site_projects'
type LocalKey = 'posts' | 'cofre' | 'projects'
const localKey: Record<Table, LocalKey> = { posts: 'posts', cofre_items: 'cofre', site_projects: 'projects' }

async function saveBySlug<T extends { slug: string }>(table: Table, row: T, originalSlug: string | null) {
  const renamed = originalSlug && originalSlug !== row.slug

  if (adminMode === 'local') {
    const db = await devRead()
    const list = db[localKey[table]] as unknown as T[]
    if ((!originalSlug || renamed) && list.some((x) => x.slug === row.slug)) throw new AdminError('Já existe outra página com esse link.')
    const i = originalSlug ? list.findIndex((x) => x.slug === originalSlug) : -1
    if (i >= 0) list[i] = row
    else list.push(row)
    if (table === 'site_projects' && renamed) db.updates.forEach((u) => u.project_slug === originalSlug && (u.project_slug = row.slug))
    await devWrite(db)
    return
  }
  if (!supabaseAdmin) throw new AdminError('Supabase não configurado.')

  const extra = table === 'site_projects' ? {} : { updated_at: new Date().toISOString() }
  const { error } = originalSlug
    ? await supabaseAdmin.from(table).update({ ...row, ...extra }).eq('slug', originalSlug)
    : await supabaseAdmin.from(table).insert({ ...row, ...extra })
  if (error?.code === '23505') throw new AdminError('Já existe outra página com esse link.')
  if (error) throw new AdminError(error.message)
}

async function deleteBySlug(table: Table, slug: string) {
  if (adminMode === 'local') {
    const db = await devRead()
    if (table === 'posts') db.posts = db.posts.filter((x) => x.slug !== slug)
    else if (table === 'cofre_items') db.cofre = db.cofre.filter((x) => x.slug !== slug)
    else {
      db.projects = db.projects.filter((x) => x.slug !== slug)
      db.updates = db.updates.filter((u) => u.project_slug !== slug)
    }
    await devWrite(db)
    return
  }
  if (!supabaseAdmin) throw new AdminError('Supabase não configurado.')
  const { error } = await supabaseAdmin.from(table).delete().eq('slug', slug)
  if (error) throw new AdminError(error.message)
}

export const savePost = (p: Post, original: string | null) => saveBySlug('posts', p, original)
export const deletePost = (slug: string) => deleteBySlug('posts', slug)
export const saveCofre = (c: CofreItem, original: string | null) => saveBySlug('cofre_items', c, original)
export const deleteCofre = (slug: string) => deleteBySlug('cofre_items', slug)
export const saveProject = (p: Project, original: string | null) => saveBySlug('site_projects', p, original)
export const deleteProject = (slug: string) => deleteBySlug('site_projects', slug)

export async function saveUpdate(u: ReturnType<typeof normalizeUpdate>) {
  if (adminMode === 'local') {
    const db = await devRead()
    if (u.id) db.updates = db.updates.map((x) => (x.id === u.id ? { ...x, ...u, id: x.id } : x))
    else db.updates.push({ ...u, id: Math.max(0, ...db.updates.map((x) => x.id)) + 1 })
    await devWrite(db)
    return
  }
  if (!supabaseAdmin) throw new AdminError('Supabase não configurado.')
  const { id, ...row } = u
  const { error } = id ? await supabaseAdmin.from('project_updates').update(row).eq('id', id) : await supabaseAdmin.from('project_updates').insert(row)
  if (error) throw new AdminError(error.message)
}

export async function deleteUpdate(id: number) {
  if (adminMode === 'local') {
    const db = await devRead()
    db.updates = db.updates.filter((x) => x.id !== id)
    await devWrite(db)
    return
  }
  if (!supabaseAdmin) throw new AdminError('Supabase não configurado.')
  const { error } = await supabaseAdmin.from('project_updates').delete().eq('id', id)
  if (error) throw new AdminError(error.message)
}

export async function saveSettings(s: SiteSettings) {
  if (adminMode === 'local') {
    const db = await devRead()
    db.settings = s
    await devWrite(db)
    return
  }
  if (!supabaseAdmin) throw new AdminError('Supabase não configurado.')
  const { error } = await supabaseAdmin.from('site_settings').upsert({ id: 'main', data: s, updated_at: new Date().toISOString() })
  if (error) throw new AdminError(error.message)
}

// ---------- mídia ----------

export interface MediaFile {
  name: string
  url: string
  size: number
  type: 'image' | 'video' | 'file'
  created_at: string
}

const kindOf = (name: string): MediaFile['type'] =>
  /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(name) ? 'image' : /\.(mp4|webm|mov|m4v)$/i.test(name) ? 'video' : 'file'

export const safeFileName = (name: string) => {
  const ext = (path.extname(name).toLowerCase().match(/^\.[a-z0-9]{1,5}$/) ?? [''])[0]
  const base = slugify(path.basename(name, path.extname(name))) || 'arquivo'
  return `${Date.now()}-${base}${ext}`
}

export const localMediaUrl = (name: string) => `/api/dev-media/${encodeURIComponent(name)}`

export async function listMedia(): Promise<MediaFile[]> {
  if (adminMode === 'local') {
    const names = await readdir(devMediaDir).catch(() => [] as string[])
    const files = await Promise.all(
      names.map(async (name) => {
        const s = await stat(path.join(devMediaDir, name))
        return { name, url: localMediaUrl(name), size: s.size, type: kindOf(name), created_at: s.mtime.toISOString() }
      })
    )
    return files.sort((a, b) => b.created_at.localeCompare(a.created_at))
  }
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } })
  if (error) throw new AdminError(`Storage: ${error.message}. O bucket "media" existe?`)
  return (data ?? [])
    .filter((f) => f.id)
    .map((f) => ({
      name: f.name,
      url: supabaseAdmin!.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
      size: (f.metadata?.size as number) ?? 0,
      type: kindOf(f.name),
      created_at: f.created_at ?? '',
    }))
}

export async function createUpload(fileName: string) {
  const name = safeFileName(fileName)
  if (adminMode === 'local') return { mode: 'local' as const, name }
  if (!supabaseAdmin) throw new AdminError('Supabase não configurado.')
  const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).createSignedUploadUrl(name)
  if (error) throw new AdminError(`Storage: ${error.message}`)
  return {
    mode: 'supabase' as const,
    name,
    token: data.token,
    publicUrl: supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl,
  }
}

export async function saveLocalMedia(name: string, bytes: Buffer) {
  await mkdir(devMediaDir, { recursive: true })
  await writeFile(path.join(devMediaDir, path.basename(name)), bytes)
  return localMediaUrl(path.basename(name))
}

export async function deleteMedia(name: string) {
  const safe = path.basename(name)
  if (adminMode === 'local') {
    await unlink(path.join(devMediaDir, safe)).catch(() => {})
    return
  }
  if (!supabaseAdmin) throw new AdminError('Supabase não configurado.')
  const { error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([safe])
  if (error) throw new AdminError(error.message)
}
