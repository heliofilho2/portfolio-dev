// Números do mídia kit no jeito que se fala: "636 mil", "1,24 mi", "6,4 milhões".

function comma(n: number, digits: number): string {
  let s = n.toFixed(digits)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  return s.replace('.', ',')
}

/** 636000 -> "636 mil", 51900 -> "51,9 mil", 1240000 -> "1,24 mi", 6400000 -> "6,4 mi". */
export function ptShort(n: number): string {
  const abs = Math.abs(n)
  if (abs < 1000) return String(Math.round(n))
  if (abs < 100_000) return `${comma(n / 1000, 1)} mil`
  if (abs < 1_000_000) return `${Math.round(n / 1000)} mil`
  return `${comma(n / 1_000_000, abs < 2_000_000 ? 2 : 1)} mi`
}

/** Para a manchete: 6400000 -> "6,4 milhões", 1200000 -> "1,2 milhão", 850000 -> "850 mil". */
export function ptLong(n: number): string {
  if (Math.abs(n) < 1_000_000) return ptShort(n)
  const v = comma(n / 1_000_000, 1)
  return `${v} ${v === '1' || v.startsWith('1,') ? 'milhão' : 'milhões'}`
}

/** 8.4 -> "8,4%". */
export function ptPct(n: number): string {
  return `${comma(n, 1)}%`
}

/** "2026-11-04T12:00:00Z" -> "04/11". */
export function ptDay(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })
}

/** "150k" (digitado no admin) -> "150 mil". Outros textos passam como estão. */
export function kToMil(count: string): string {
  const m = /^(\d+(?:[.,]\d+)?)\s*k(\+?)$/i.exec(count.trim())
  return m ? `${m[1].replace('.', ',')} mil${m[2]}` : count
}
