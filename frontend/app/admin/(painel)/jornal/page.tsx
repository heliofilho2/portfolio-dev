import JornalExtraEditor from '@/components/admin/JornalExtraEditor'
import { loadJornalExtra } from '@/lib/adminStore'

export const dynamic = 'force-dynamic'

// "Hoje" no fuso de São Paulo, não no fuso do servidor (a Vercel roda em UTC).
function todayInSaoPaulo(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export default async function JornalExtrasPage() {
  const date = todayInSaoPaulo()
  const extra = await loadJornalExtra(date)
  return <JornalExtraEditor extra={extra} />
}
