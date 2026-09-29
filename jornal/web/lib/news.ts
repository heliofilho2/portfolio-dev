import { createClient } from '@supabase/supabase-js'
import type { Priority } from './taxonomy'
import { sampleNews } from './sample'

export interface NewsItem {
  id: number
  url: string
  title_pt: string
  source: string
  published_at: string
  summary_pt: string
  category: string
  topics: string[]
  priority: Priority
  trending: boolean
}

const WINDOW_HOURS = 48

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
    : null

// Sem Supabase configurado, só em desenvolvimento, usa os dados de exemplo do protótipo
export const usingSampleData = !supabase && process.env.NODE_ENV === 'development'

export async function getNews(): Promise<NewsItem[]> {
  if (!supabase) return usingSampleData ? sampleNews() : []

  const since = new Date(Date.now() - WINDOW_HOURS * 3600_000).toISOString()
  const { data, error } = await supabase
    .from('news_items')
    .select('id, url, title_pt, source, published_at, summary_pt, category, topics, priority, trending')
    .gte('published_at', since)
    .order('published_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('[news] falha ao ler o Supabase:', error.message)
    return []
  }
  return data as NewsItem[]
}

const priorityRank: Record<Priority, number> = { alta: 0, media: 1, baixa: 2 }

// Ordem do jornal: em alta primeiro, depois prioridade, depois mais recente
export function editorialSort(a: NewsItem, b: NewsItem) {
  if (a.trending !== b.trending) return a.trending ? -1 : 1
  if (a.priority !== b.priority) return priorityRank[a.priority] - priorityRank[b.priority]
  return b.published_at.localeCompare(a.published_at)
}

export type EditionItem = NewsItem & { timeLabel: string }

// Monta a edição no momento da renderização (ISR): ordem editorial + "há X horas"
export async function getEdition(): Promise<EditionItem[]> {
  const now = Date.now()
  const news = await getNews()
  return [...news].sort(editorialSort).map((item) => ({ ...item, timeLabel: timeAgo(item.published_at, now) }))
}

function timeAgo(iso: string, now: number) {
  const minutes = Math.max(1, Math.round((now - new Date(iso).getTime()) / 60_000))
  if (minutes < 60) return `${minutes} min atrás`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.round(hours / 24)
  return days === 1 ? '1 dia atrás' : `${days} dias atrás`
}
