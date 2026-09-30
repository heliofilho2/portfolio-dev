import Link from 'next/link'
import LoadError from '@/components/admin/LoadError'
import { btn } from '@/components/admin/styles'
import { fmtDate } from '@/lib/contentModel'
import { loadAdmin } from '@/lib/adminLoad'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const { data, error } = await loadAdmin()
  if (!data) return <LoadError error={error} />

  const drafts = data.posts.filter((p) => !p.published).length + data.cofre.filter((c) => c.published === false).length
  const stats = [
    { label: 'Posts', value: data.posts.length, href: '/admin/posts', bg: 'bg-lilac' },
    { label: 'Cofre', value: data.cofre.length, href: '/admin/cofre', bg: 'bg-butter' },
    { label: 'Projetos', value: data.projects.length, href: '/admin/projetos', bg: 'bg-mint' },
    { label: 'Rascunhos', value: drafts, href: '/admin/posts', bg: 'bg-peach' },
  ]

  const recent = [
    ...data.posts.map((p) => ({ key: `p-${p.slug}`, title: p.title, kind: 'Blog', date: p.published_at, href: `/admin/posts/${p.slug}` })),
    ...data.cofre.map((c) => ({ key: `c-${c.slug}`, title: c.title, kind: `Cofre · ${c.category}`, date: c.published_at, href: `/admin/cofre/${c.slug}` })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="hand-note -rotate-2">bora publicar?</div>
        <h1 className="font-serif text-[clamp(36px,5vw,52px)] leading-none mt-1">
          Oi, <em className="text-accent">Hélio</em>
        </h1>
      </div>

      <div className="grid gap-2.5 sm:gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`${s.bg} rounded-[20px] p-4 sm:p-5 text-ink hover:text-ink transition-transform hover:-translate-y-0.5`}>
            <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase">{s.label}</span>
            <span className="block font-serif text-[40px] leading-none mt-3">{s.value}</span>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-subtle mb-2.5">Criar</h2>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {[
            { href: '/admin/cofre/novo', title: 'Página de vídeo', text: 'Link pra mandar na DM, com materiais e capítulos.' },
            { href: '/admin/posts/novo', title: 'Post no blog', text: 'Texto com fotos e vídeos, tipo artigo.' },
            { href: '/admin/projetos/novo', title: 'Projeto', text: 'README, estudo de caso e diário.' },
          ].map((a) => (
            <Link key={a.href} href={a.href} className="group bg-surface border border-line rounded-[20px] p-4 sm:p-5 text-ink hover:text-ink hover:border-ink transition-colors">
              <span className="flex justify-between items-center">
                <span className="font-serif text-[23px] leading-tight">{a.title}</span>
                <span className="w-8 h-8 rounded-full bg-ink text-surface flex items-center justify-center text-lg transition-transform group-hover:rotate-90">+</span>
              </span>
              <span className="block text-[14px] text-muted mt-1.5">{a.text}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
        <div>
          <h2 className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-subtle mb-2.5">Mexido por último</h2>
          <div className="bg-surface border border-line rounded-[20px] px-4">
            {recent.map((r) => (
              <Link key={r.key} href={r.href} className="flex items-center gap-3 py-3 border-b last:border-b-0 border-line text-ink hover:text-accent">
                <span className="flex-1 min-w-0 truncate font-medium text-[15px]">{r.title}</span>
                <span className="hidden sm:block font-mono text-[11px] text-subtle shrink-0">{r.kind}</span>
                <span className="font-mono text-[11px] text-subtle shrink-0">{fmtDate(r.date)}</span>
              </Link>
            ))}
            {recent.length === 0 && <p className="py-6 text-sm text-subtle">Nada ainda.</p>}
          </div>
        </div>
        <div className="bg-surface border border-line rounded-[20px] p-4 sm:p-5 flex flex-col gap-3">
          <h2 className="font-serif text-[22px]">Atalhos</h2>
          <Link href="/admin/site" className={btn.ghost}>
            Mudar foto, bio e redes
          </Link>
          <Link href="/admin/midia" className={btn.ghost}>
            Biblioteca de fotos e vídeos
          </Link>
          <p className="text-[12.5px] text-subtle leading-snug">Dica: nos editores, Ctrl+S salva. Tudo que você salva aparece no site na hora.</p>
        </div>
      </div>
    </div>
  )
}
