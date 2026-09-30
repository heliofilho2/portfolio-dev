import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { adminEnabled, isAdmin } from '@/lib/adminAuth'
import { devStoreOn } from '@/lib/devStore'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Entrar | painel', robots: { index: false, follow: false } }

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin')

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px] bg-surface border border-line rounded-[26px] p-6 sm:p-8 shadow-[0_30px_60px_-40px_rgba(30,28,25,.45)]">
        <div className="font-serif text-[28px] leading-none">
          helio<em className="text-accent">filho</em>.dev
        </div>
        <div className="hand-note -rotate-2 mt-2">bem-vindo de volta</div>
        {adminEnabled ? (
          <>
            <LoginForm />
            {devStoreOn && <p className="text-[12.5px] text-subtle mt-4">Modo local: a senha é &quot;admin&quot;.</p>}
          </>
        ) : (
          <p className="text-[14.5px] text-muted mt-5 leading-relaxed">
            Painel desligado. Defina <code className="font-mono text-[13px] bg-chip px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code> nas variáveis da Vercel e faça um novo deploy.
          </p>
        )}
      </div>
    </main>
  )
}
