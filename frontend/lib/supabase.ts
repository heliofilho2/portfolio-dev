import { createClient } from '@supabase/supabase-js'

// Mesmo Supabase do backend .NET (projeto qnjrobyvhaoxcqhinsov).
// Usado aqui só para o que o backend não expõe: newsletter (subscribers) e a
// prévia do Jornal (news_items), ambos com RLS liberando leitura/insert pública.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null
