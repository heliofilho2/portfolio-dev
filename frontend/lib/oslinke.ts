import 'server-only'

// Puxa Reels recentes e contagem de seguidores direto do Oslinke (o mesmo app conectado ao
// Instagram real), em vez de depender de edição manual no /admin toda vez que sai um vídeo novo.
// Rota pequena e somente-leitura, protegida por segredo compartilhado - ver
// manochat/app/api/public/reels/route.ts. Falha de qualquer tipo (rede, timeout, segredo errado)
// não pode derrubar a home: sempre volta vazio, e quem chama cai pro que já tinha.

export interface LiveReel {
  id: string
  caption: string | null
  thumbnailUrl: string | null
  permalink: string | null
  views: number | null
  timestamp: string | null
}

export interface OslinkeData {
  followers: number | null
  reels: LiveReel[]
}

const EMPTY: OslinkeData = { followers: null, reels: [] }

async function fetchReels(query: string): Promise<OslinkeData> {
  const url = process.env.OSLINKE_API_URL
  const secret = process.env.OSLINKE_API_SECRET
  if (!url || !secret) return EMPTY

  try {
    const res = await fetch(`${url}/api/public/reels${query}`, {
      headers: { Authorization: `Bearer ${secret}` },
      next: { revalidate: 1800 }, // 30min: segue o mesmo espírito do cache de 10min do resto do site, sem bater toda hora numa API externa
    })
    if (!res.ok) return EMPTY
    return (await res.json()) as OslinkeData
  } catch (e) {
    console.error('[oslinke] falha ao buscar reels/seguidores:', e)
    return EMPTY
  }
}

/** Os 4 mais recentes - pro teaser da home, mostra o que acabou de sair. */
export async function getOslinkeData(): Promise<OslinkeData> {
  return fetchReels('')
}

/** Os mais virais dos últimos N dias - pro media kit, mostra o número que impressiona. */
export async function getTopReels(days = 14, limit = 4): Promise<OslinkeData> {
  return fetchReels(`?sort=top&days=${days}&limit=${limit}`)
}

/** "84000" -> "84k", "1234000" -> "1,2M". Mesmo formato que já era digitado à mão no admin. */
export function compactCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0).replace('.', ',').replace(/,0$/, '')}k`
  return `${(n / 1_000_000).toFixed(1).replace('.', ',').replace(/,0$/, '')}M`
}
