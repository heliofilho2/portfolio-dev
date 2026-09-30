import { sampleRows } from './sample'
import { sources } from './taxonomy'
import { supabase, usingSampleData } from './supabase'

const WINDOW_HOURS = 48

export interface RawRow {
  title_pt: string
  summary_pt: string
  source: string
  published_at: string
  category: string
  priority: 'alta' | 'media' | 'baixa'
  trending: boolean
}

export interface NewsItem extends RawRow {
  kicker: string
  timeLabel: string
}

async function fetchRows(): Promise<RawRow[]> {
  if (!supabase) return usingSampleData ? sampleRows : []

  const since = new Date(Date.now() - WINDOW_HOURS * 3600_000).toISOString()
  const { data, error } = await supabase
    .from('news_items')
    .select('title_pt, summary_pt, source, published_at, category, priority, trending')
    .eq('hidden', false)
    .gte('published_at', since)
    .order('published_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('[jornal] falha ao ler o Supabase:', error.message)
    return []
  }
  return data as RawRow[]
}

const priorityRank: Record<RawRow['priority'], number> = { alta: 0, media: 1, baixa: 2 }

function kickerFor(row: RawRow): string {
  if (!row.trending) return row.category
  return (row.priority === 'alta' ? 'Urgente · ' : 'Em alta · ') + row.category
}

function timeLabel(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(iso)) + 'h'
}

export interface TickerRow {
  name: string
  today: number
  yesterday: number
  arrow: '▲' | '▼' | '■'
  colorClass: string
}

function buildTicker(rows: RawRow[]): TickerRow[] {
  const now = Date.now()
  const dayMs = 24 * 3600_000
  const counts = new Map<string, { today: number; yesterday: number }>()
  for (const s of sources) counts.set(s, { today: 0, yesterday: 0 })

  for (const row of rows) {
    const age = now - new Date(row.published_at).getTime()
    const bucket = counts.get(row.source)
    if (!bucket) continue
    if (age <= dayMs) bucket.today++
    else if (age <= dayMs * 2) bucket.yesterday++
  }

  return [...counts.entries()].map(([name, { today, yesterday } ]) => ({
    name,
    today,
    yesterday,
    arrow: today > yesterday ? '▲' : today < yesterday ? '▼' : '■',
    colorClass: today > yesterday ? 'text-[#2F6B3F]' : today < yesterday ? 'text-[#C4584C]' : 'text-ink',
  }))
}

export interface Edition {
  categories: string[]
  lead: NewsItem | null
  rest: NewsItem[]
  trending: NewsItem[]
  ticker: TickerRow[]
  total: number
  trendingCount: number
}

// Regras de dados: ver docs/design/jornal/README.md "Regras de dados".
// Duas simplificações em relação ao mock (cada linha aqui é um artigo de UMA fonte,
// não uma notícia já fundida entre fontes: isso exigiria um passo de clustering que
// o coletor ainda não faz):
//  - a manchete não tem corpo em 3 parágrafos: usa o summary_pt real (curto) como corpo único.
//  - "Em alta" e a legenda da manchete mostram a fonte de origem, não "N fontes".
export async function getEdition(category: string | null, onlyTrending: boolean): Promise<Edition> {
  const rows = await fetchRows()
  const categories = [...new Set(rows.map((r) => r.category))].sort()

  const filtered = rows.filter((r) => (!category || r.category === category) && (!onlyTrending || r.trending))
  const sorted = [...filtered].sort((a, b) => {
    if (a.trending !== b.trending) return a.trending ? -1 : 1
    if (a.priority !== b.priority) return priorityRank[a.priority] - priorityRank[b.priority]
    return b.published_at.localeCompare(a.published_at)
  })

  const items: NewsItem[] = sorted.map((r) => ({ ...r, kicker: kickerFor(r), timeLabel: timeLabel(r.published_at) }))
  const trendingAll = [...rows]
    .filter((r) => r.trending)
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || b.published_at.localeCompare(a.published_at))
    .slice(0, 4)
    .map((r) => ({ ...r, kicker: kickerFor(r), timeLabel: timeLabel(r.published_at) }))

  return {
    categories,
    lead: items[0] ?? null,
    rest: items.slice(1),
    trending: trendingAll,
    ticker: buildTicker(rows),
    total: rows.length,
    trendingCount: rows.filter((r) => r.trending).length,
  }
}
