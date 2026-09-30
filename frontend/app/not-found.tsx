import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="wrap py-20 text-center">
        <p className="font-mono text-sm text-accent mb-3">404</p>
        <h1 className="h-page mb-4">Página não encontrada</h1>
        <p className="text-muted mb-8">O link pode estar quebrado ou a página foi removida.</p>
        <Link href="/" className="inline-flex px-5 py-3 rounded-full bg-ink text-surface hover:text-surface text-sm font-medium hover:opacity-90 transition-opacity">
          Voltar para o início
        </Link>
      </main>
      <Footer />
    </>
  )
}
