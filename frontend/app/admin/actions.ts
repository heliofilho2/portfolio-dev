'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { endSession, isAdmin, startSession } from '@/lib/adminAuth'
import * as store from '@/lib/adminStore'
import { fetchReadme } from '@/lib/github'

export type ActionResult = { ok: true; slug?: string } | { ok: false; error: string }

// Envolve cada ação: checa login, traduz erro pra mensagem legível e atualiza o site publicado.
async function guarded(run: () => Promise<string | void>): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: 'Sessão expirada. Entre de novo.' }
  try {
    const slug = await run()
    revalidatePath('/', 'layout')
    return { ok: true, ...(slug ? { slug } : {}) }
  } catch (e) {
    if (e instanceof store.AdminError) return { ok: false, error: e.message }
    console.error('[admin]', e)
    return { ok: false, error: 'Algo deu errado ao salvar. Tenta de novo.' }
  }
}

export async function login(_prev: { error: string }, form: FormData): Promise<{ error: string }> {
  if (await startSession(String(form.get('password') ?? ''))) redirect('/admin')
  return { error: 'Senha incorreta.' }
}

export async function logout() {
  await endSession()
  redirect('/admin/login')
}

type Input = Record<string, unknown>

export async function savePost(input: Input, original: string | null) {
  return guarded(async () => {
    const post = store.normalizePost(input)
    await store.savePost(post, original)
    return post.slug
  })
}

export async function deletePost(slug: string) {
  return guarded(() => store.deletePost(slug))
}

export async function saveCofre(input: Input, original: string | null) {
  return guarded(async () => {
    const item = store.normalizeCofre(input)
    await store.saveCofre(item, original)
    return item.slug
  })
}

export async function deleteCofre(slug: string) {
  return guarded(() => store.deleteCofre(slug))
}

export async function saveProject(input: Input, original: string | null) {
  return guarded(async () => {
    const project = store.normalizeProject(input)
    await store.saveProject(project, original)
    return project.slug
  })
}

export async function deleteProject(slug: string) {
  return guarded(() => store.deleteProject(slug))
}

export async function saveJornalExtra(input: Input) {
  return guarded(async () => {
    await store.saveJornalExtra(store.normalizeJornalExtra(input))
  })
}

// Puxa o README real do repositório público, pra começar a escrever a partir dele em vez
// de copiar e colar. Só leitura, não mexe no GitHub.
export async function importReadme(repoUrl: string) {
  if (!(await isAdmin())) return { ok: false as const, error: 'Sessão expirada. Entre de novo.' }
  const result = await fetchReadme(repoUrl)
  return 'error' in result ? { ok: false as const, error: result.error } : { ok: true as const, markdown: result.markdown }
}

export async function saveUpdate(input: Input) {
  return guarded(() => store.saveUpdate(store.normalizeUpdate(input)))
}

export async function deleteUpdate(id: number) {
  return guarded(() => store.deleteUpdate(id))
}

export async function saveSettings(input: Input) {
  return guarded(() => store.saveSettings(store.normalizeSettings(input)))
}

export async function listMedia(): Promise<store.MediaFile[]> {
  if (!(await isAdmin())) return []
  return store.listMedia()
}

export async function deleteMedia(name: string) {
  return guarded(() => store.deleteMedia(name))
}

export async function createUpload(fileName: string) {
  if (!(await isAdmin())) return { ok: false as const, error: 'Sessão expirada. Entre de novo.' }
  try {
    return { ok: true as const, ...(await store.createUpload(fileName)) }
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Falha ao preparar o envio.' }
  }
}
