import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import * as store from '@/lib/adminStore'

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
