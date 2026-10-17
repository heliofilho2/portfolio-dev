import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import * as store from '@/lib/adminStore'
import { MEDIA_BUCKET, supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Cria ou atualiza uma página do Cofre sem passar pelo /admin.
// Único consumidor: a esteira da Central do Criador (ponte no PC do Helio), quando um vídeo pede
// "comenta PALAVRA": a página tem de existir (e responder 200) antes do agendamento.
// Segredo próprio: Authorization: Bearer COFRE_AGENT_SECRET. Sem a variável, a rota fica desligada.
// Corpo: os mesmos campos do editor do Cofre (normalizeCofre). Mesmo slug = atualiza a mesma página.

function authorized(request: Request): boolean {
  const secret = process.env.COFRE_AGENT_SECRET?.trim()
  if (!secret) return false
  const a = Buffer.from(request.headers.get('authorization') ?? '')
  const b = Buffer.from(`Bearer ${secret}`)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  if (!authorized(request)) return new NextResponse('Unauthorized', { status: 401 })
  let input: Record<string, unknown>
  try {
    input = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'corpo não é JSON' }, { status: 400 })
  }
  try {
    const item = store.normalizeCofre(input)
    const { cofre } = await store.loadAll()
    const exists = cofre.some((c) => c.slug === item.slug)
    await store.saveCofre(item, exists ? item.slug : null)
    revalidatePath('/', 'layout')
    return NextResponse.json(
      { slug: item.slug, url: `https://heliofilho.dev/cofre/${item.slug}`, published: item.published, created: !exists },
      { status: exists ? 200 : 201 },
    )
  } catch (e) {
    if (e instanceof store.AdminError) return NextResponse.json({ error: e.message }, { status: 422 })
    console.error('[agent/cofre]', e)
    return NextResponse.json({ error: 'falha ao salvar' }, { status: 500 })
  }
}

// Troca só a capa de uma página que já existe: {"slug": "...", "image_base64": "...", "content_type": "image/jpeg"}.
// A imagem vai para o bucket público de mídia e o resto da página não muda.
const COVER_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export async function PATCH(request: Request) {
  if (!authorized(request)) return new NextResponse('Unauthorized', { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  let body: { slug?: string; image_base64?: string; content_type?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'corpo não é JSON' }, { status: 400 })
  }
  const slug = String(body.slug ?? '').trim()
  const ext = COVER_TYPES[String(body.content_type ?? '')]
  if (!/^[a-z0-9-]{1,120}$/.test(slug) || !ext || !body.image_base64) {
    return NextResponse.json({ error: 'mande slug, image_base64 e content_type (jpeg, png ou webp)' }, { status: 422 })
  }
  const bytes = Buffer.from(body.image_base64, 'base64')
  if (bytes.length === 0 || bytes.length > 3_000_000) return NextResponse.json({ error: 'imagem vazia ou acima de 3 MB' }, { status: 422 })

  const { data: rows, error: findError } = await supabaseAdmin.from('cofre_items').select('slug').eq('slug', slug)
  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 })
  if (!rows?.length) return NextResponse.json({ error: `página ${slug} não existe` }, { status: 404 })

  const name = `cofre-capas/${slug}-${Date.now()}.${ext}`
  const up = await supabaseAdmin.storage.from(MEDIA_BUCKET).upload(name, bytes, { contentType: String(body.content_type), upsert: false })
  if (up.error) return NextResponse.json({ error: `storage: ${up.error.message}` }, { status: 500 })
  const url = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl

  const { error } = await supabaseAdmin.from('cofre_items').update({ cover_url: url, updated_at: new Date().toISOString() }).eq('slug', slug)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/', 'layout')
  return NextResponse.json({ slug, cover_url: url })
}
