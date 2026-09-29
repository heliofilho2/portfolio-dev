import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="font-mono text-sm text-accent mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Página não encontrada</h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8">
          O link pode estar quebrado ou a página foi removida.
        </p>
        <Link
          href="/"
          className="inline-flex px-4 py-2.5 rounded-xl bg-ink text-surface-light dark:text-background-dark text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Voltar para o início
        </Link>
      </main>
      <Footer />
    </>
  )
}
