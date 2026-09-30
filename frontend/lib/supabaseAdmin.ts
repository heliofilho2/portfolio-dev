import { createClient } from '@supabase/supabase-js'

// Cliente com a service role: ignora RLS. Só pode ser usado no servidor, dentro de ações
// que já passaram por requireAdmin(). A chave nunca vai pro navegador (sem NEXT_PUBLIC_).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null

export const MEDIA_BUCKET = 'media'
