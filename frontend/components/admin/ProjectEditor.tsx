'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteProject, deleteUpdate, importReadme, saveProject, saveUpdate } from '@/app/admin/actions'
import { fmtDate, projectStatuses, slugify, type Project, type ProjectUpdate } from '@/lib/contentModel'
import EditorShell, { Toast, useDraft } from './EditorShell'
import MarkdownEditor from './MarkdownEditor'
import MediaField from './MediaField'
import { DateField, SlugField, StatusPill, titleInput } from './fields'
import { btn, Card, Field, Select, StringListField, TextArea, TextInput, Toggle, TonePicker } from './ui'

// Diário do projeto: relatórios curtos de novidade, cada um salvo na hora.
function UpdatesEditor({ projectSlug, updates }: { projectSlug: string; updates: ProjectUpdate[] }) {
  const router = useRouter()
  const blank = { title: '', body_md: '', published_at: new Date().toISOString() }
  const [editing, setEditing] = useState<{ id?: number; title: string; body_md: string; published_at: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null)

  async function submit() {
    if (!editing) return
    setBusy(true)
    const r = await saveUpdate({ ...editing, project_slug: projectSlug })
    setBusy(false)
    if (!r.ok) return setToast({ message: r.error, error: true })
    setToast({ message: 'Atualização publicada ✓' })
    setEditing(null)
    router.refresh()
  }

  return (
    <Card title="Diário do projeto" hint="Relatórios de novidades e integrações novas. Aparecem no fim da página do projeto.">
      {!editing && (
        <button type="button" className={`${btn.primary} self-start`} onClick={() => setEditing(blank)}>
          + Nova atualização
        </button>
      )}
      {editing && (
        <div className="rounded-2xl border border-ink p-3 sm:p-4 flex flex-col gap-3 bg-bg">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <Field label="Título">
              <TextInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Integração com o Substack no ar" />
            </Field>
            <DateField value={editing.published_at} onChange={(v) => setEditing({ ...editing, published_at: v })} />
          </div>
          <MarkdownEditor value={editing.body_md} onChange={(v) => setEditing({ ...editing, body_md: v })} placeholder="O que mudou, por quê e o que vem depois." minHeight={200} />
          <div className="flex gap-2 justify-end">
            <button type="button" className={btn.ghost} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="button" className={btn.primary} onClick={submit} disabled={busy}>
              {busy ? 'Salvando…' : editing.id ? 'Salvar atualização' : 'Publicar atualização'}
            </button>
          </div>
        </div>
      )}
      {updates.length > 0 && (
        <div className="flex flex-col">
          {updates.map((u) => (
            <div key={u.id} className="flex gap-3 items-center py-2.5 border-t border-line">
              <span className="font-mono text-[11.5px] text-subtle w-24 shrink-0">{fmtDate(u.published_at)}</span>
              <span className="flex-1 min-w-0 truncate text-[15px] font-medium">{u.title}</span>
              <button type="button" className="text-[13px] text-accent cursor-pointer" onClick={() => setEditing({ id: u.id, title: u.title, body_md: u.body_md, published_at: u.published_at })}>
                Editar
              </button>
              <button
                type="button"
                className="text-[13px] text-[#B4453A] cursor-pointer"
                onClick={async () => {
                  if (!confirm('Apagar esta atualização?')) return
                  const r = await deleteUpdate(u.id)
                  if (!r.ok) setToast({ message: r.error, error: true })
                  router.refresh()
                }}
              >
                Apagar
              </button>
            </div>
          ))}
        </div>
      )}
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </Card>
  )
}

export default function ProjectEditor({ project, isNew, updates }: { project: Project; isNew: boolean; updates: ProjectUpdate[] }) {
  const router = useRouter()
  const { data, set, dirty, markSaved } = useDraft(project)
  const [original, setOriginal] = useState<string | null>(isNew ? null : project.slug)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const published = data.published !== false

  const setName = (name: string) => {
    set('name', name)
    if (!slugTouched) set('slug', slugify(name))
  }

  async function doImportReadme() {
    if (!data.repo_url) return
    if (data.readme_md.trim() && !confirm('Já tem texto no README. Substituir pelo conteúdo do GitHub?')) return
    setImporting(true)
    setImportError('')
    const r = await importReadme(data.repo_url)
    setImporting(false)
    if (r.ok) set('readme_md', r.markdown)
    else setImportError(r.error)
  }

  return (
    <EditorShell
      back={{ href: '/admin/projetos', label: 'Projetos' }}
      title={data.name || 'Novo projeto'}
      status={<StatusPill published={published} />}
      viewHref={original && published ? `/projetos/${original}` : null}
      dirty={dirty}
      onSave={() => saveProject({ ...data }, original)}
      onSaved={(r) => {
        markSaved()
        if (r.slug && r.slug !== original) {
          setOriginal(r.slug)
          router.replace(`/admin/projetos/${r.slug}`)
        }
      }}
      onDelete={
        original
          ? async () => {
              const r = await deleteProject(original)
              if (r.ok) router.push('/admin/projetos')
              return r
            }
          : undefined
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
        <div className="flex flex-col gap-4 min-w-0">
          <input value={data.name} onChange={(e) => setName(e.target.value)} placeholder="Nome do projeto" className={titleInput} autoFocus={isNew} />
          <TextArea value={data.summary} onChange={(v) => set('summary', v)} placeholder="Uma frase: o que é e pra quem" minRows={2} />

          <Card title="Estudo de caso" hint="Tudo opcional. Seção vazia não aparece no site.">
            <Field label="O problema">
              <TextArea value={data.problem ?? ''} onChange={(v) => set('problem', v || null)} minRows={2} />
            </Field>
            <Field label="A solução">
              <TextArea value={data.solution ?? ''} onChange={(v) => set('solution', v || null)} minRows={2} />
            </Field>
            <Field label="Arquitetura" hint="Cada item vira uma caixinha, na ordem do fluxo.">
              <StringListField value={data.arch} onChange={(v) => set('arch', v)} placeholder="Supabase Postgres" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Decisões técnicas">
                <StringListField value={data.decisions} onChange={(v) => set('decisions', v)} />
              </Field>
              <Field label="Trade-offs">
                <StringListField value={data.tradeoffs} onChange={(v) => set('tradeoffs', v)} />
              </Field>
            </div>
          </Card>

          <div>
            <div className="flex justify-between items-center flex-wrap gap-2 mb-1.5">
              <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-subtle">README</div>
              {data.repo_url && (
                <button type="button" className="text-[12.5px] font-medium text-accent cursor-pointer disabled:opacity-50" onClick={doImportReadme} disabled={importing}>
                  {importing ? 'Importando…' : '↓ Importar do GitHub'}
                </button>
              )}
            </div>
            {importError && <p className="text-[12.5px] text-[#B4453A] mb-1.5">{importError}</p>}
            <MarkdownEditor
              value={data.readme_md}
              onChange={(v) => set('readme_md', v)}
              placeholder="Explique o projeto pra quem não é expert: a ideia, pré-requisitos, passo a passo de como usar, prints, próximos passos."
              minHeight={320}
            />
          </div>

          {original ? (
            <UpdatesEditor projectSlug={original} updates={updates} />
          ) : (
            <p className="text-[13.5px] text-subtle">Salve o projeto pra começar o diário.</p>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card>
            <Toggle checked={published} onChange={(v) => set('published', v)} label={published ? 'Publicado' : 'Rascunho'} hint={published ? 'Visível em Projetos' : 'Só você vê'} />
            <Field label="Status">
              <Select value={data.status} onChange={(v) => set('status', v)} options={projectStatuses} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <TextInput value={data.type} onChange={(v) => set('type', v)} placeholder="Produto" />
              </Field>
              <Field label="Ano">
                <TextInput value={data.year ?? ''} onChange={(v) => set('year', v || null)} placeholder="2026" />
              </Field>
            </div>
            <Field label="Stack">
              <TextInput value={data.stack} onChange={(v) => set('stack', v)} placeholder="Next.js · Supabase" />
            </Field>
            <Field label="Link do projeto no ar">
              <TextInput value={data.url ?? ''} onChange={(v) => set('url', v || null)} placeholder="https://…" />
            </Field>
            <Field label="GitHub">
              <TextInput value={data.repo_url ?? ''} onChange={(v) => set('repo_url', v || null)} placeholder="https://github.com/…" />
            </Field>
            {data.repo_url && (
              <div>
                <button type="button" className={btn.ghost} onClick={doImportReadme} disabled={importing}>
                  {importing ? 'Importando…' : '↓ Importar README do GitHub'}
                </button>
                {importError && <p className="text-[12.5px] text-[#B4453A] mt-1.5">{importError}</p>}
              </div>
            )}
            <SlugField
              prefix="/projetos/"
              value={data.slug}
              onChange={(v) => {
                setSlugTouched(true)
                set('slug', v)
              }}
            />
            <Field label="Ordem" hint="Menor aparece primeiro. A home mostra os 4 primeiros.">
              <TextInput type="number" value={String(data.sort)} onChange={(v) => set('sort', Number(v) || 0)} />
            </Field>
            <Field label="Cor">
              <TonePicker value={data.tone} onChange={(v) => set('tone', v)} />
            </Field>
          </Card>
          <Card title="Imagem de capa" hint="Opcional. Substitui a letra grande no topo da página.">
            <MediaField value={data.cover_url ?? ''} onChange={(v) => set('cover_url', v || null)} />
          </Card>
        </div>
      </div>
    </EditorShell>
  )
}
