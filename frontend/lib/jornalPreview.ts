import { supabase } from './supabase'

export interface JornalPreviewItem {
  title: string
  meta: string
  dot: string
}

const dotByPriority: Record<string, string> = { alta: 'bg-prio-alta', media: 'bg-prio-media', baixa: 'bg-prio-baixa' }

// Top 4 do Jornal (mesmo Supabase) pra aside "Hoje no jornal" da home.
// Sem Supabase configurado, ou sem notícias ainda, a seção mostra o estado vazio.
export async function getJornalPreview(): Promise<{ items: JornalPreviewItem[]; count: number }> {
  if (!supabase) return { items: [], count: 0 }

  const since = new Date(Date.now() - 48 * 3600_000).toISOString()
  const { data, error } = await supabase
    .from('news_items')
    .select('title_pt, source, priority, trending')
    .gte('published_at', since)
    .order('published_at', { ascending: false })
    .limit(50)

  if (error || !data) return { items: [], count: 0 }

  const rank: Record<string, number> = { alta: 0, media: 1, baixa: 2 }
  const sorted = [...data].sort((a, b) => (a.trending === b.trending ? rank[a.priority] - rank[b.priority] : a.trending ? -1 : 1))

  return {
    count: data.length,
    items: sorted.slice(0, 4).map((item) => ({
      title: item.title_pt,
      meta: `${item.trending ? 'Em alta · ' : ''}${item.source}`,
      dot: dotByPriority[item.priority] ?? 'bg-prio-baixa',
    })),
  }
}
