'use client'

import { createUpload } from '@/app/admin/actions'
import { supabase } from '@/lib/supabase'

export const MAX_UPLOAD_MB = 50

export const isVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)

// Envia um arquivo e devolve a URL pública. Com Supabase, o navegador manda direto pro
// Storage usando uma URL assinada (não passa pelo servidor, então vídeo grande funciona).
export async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`Arquivo maior que ${MAX_UPLOAD_MB}MB. Para vídeo longo, use o link do YouTube ou Instagram.`)

  const prep = await createUpload(file.name)
  if (!prep.ok) throw new Error(prep.error)

  if (prep.mode === 'local') {
    const form = new FormData()
    form.set('file', file)
    form.set('name', prep.name)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const json = (await res.json()) as { url?: string; error?: string }
    if (!res.ok || !json.url) throw new Error(json.error ?? 'Falha no envio.')
    return json.url
  }

  if (!supabase) throw new Error('Supabase não configurado no navegador (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY).')
  const { error } = await supabase.storage.from('media').uploadToSignedUrl(prep.name, prep.token, file, { contentType: file.type || undefined })
  if (error) throw new Error(error.message)
  return prep.publicUrl
}
