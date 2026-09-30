import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'
import { adminMode, saveLocalMedia } from '@/lib/adminStore'

// Upload no modo local (sem Supabase). Em produção o navegador envia direto pro Supabase Storage.
export async function POST(request: Request) {
  if (adminMode !== 'local') return NextResponse.json({ error: 'Só no modo local.' }, { status: 404 })
  if (!(await isAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  const form = await request.formData()
  const file = form.get('file')
  const name = String(form.get('name') ?? '')
  if (!(file instanceof File) || !name) return NextResponse.json({ error: 'Arquivo ausente.' }, { status: 400 })
  const url = await saveLocalMedia(name, Buffer.from(await file.arrayBuffer()))
  return NextResponse.json({ url })
}
