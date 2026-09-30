import type { Metadata } from 'next'
import AdminNav from '@/components/admin/AdminNav'
import { requireAdmin } from '@/lib/adminAuth'
import { adminMode } from '@/lib/adminStore'

export const metadata: Metadata = { title: 'Painel | helio*filho*.dev', robots: { index: false, follow: false } }

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen">
      <AdminNav />
      <div className="lg:pl-56">
        {adminMode === 'local' && (
          <div className="bg-butter text-[13px] px-4 py-2 text-center">Modo local: sem Supabase, as alterações ficam em frontend/.dev-content (fora do git).</div>
        )}
        {adminMode === 'off' && (
          <div className="bg-rose text-[13px] px-4 py-2 text-center">
            Falta configurar SUPABASE_SERVICE_ROLE_KEY na Vercel: dá pra ver o painel, mas não salvar.
          </div>
        )}
        <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1280px]">{children}</main>
      </div>
    </div>
  )
}
