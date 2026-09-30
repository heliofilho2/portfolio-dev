import { createClient } from '@supabase/supabase-js'

// Mesmo Supabase do backend .NET (projeto qnjrobyvhaoxcqhinsov).
// Leitura pública (chave anon + RLS): conteúdo do site (cofre, projetos, posts, configurações)
// e a prévia do Jornal (news_items). Escrita só pelo /admin, com a service role no servidor.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null
