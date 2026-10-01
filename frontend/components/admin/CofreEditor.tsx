'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteCofre, saveCofre } from '@/app/admin/actions'
import { cofreCategories, slugify, type CofreItem } from '@/lib/contentModel'
import EditorShell, { useDraft } from './EditorShell'
import MarkdownEditor from './MarkdownEditor'
import MediaField from './MediaField'
import { DateField, SlugField, StatusPill, titleInput } from './fields'
import { Card, Field, ObjectListField, Select, TextArea, TextInput, Toggle, TonePicker } from './ui'

export default function CofreEditor({ item, isNew, topics }: { item: CofreItem; isNew: boolean; topics: string[] }) {
  const router = useRouter()
  const { data, set, dirty, markSaved } = useDraft(item)
  const [original, setOriginal] = useState<string | null>(isNew ? null : item.slug)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const isVideo = data.category === 'Vídeos'
  const published = data.published !== false

  const setTitle = (title: string) => {
    set('title', title)
    if (!slugTouched) set('slug', slugify(title))
  }

  return (
    <EditorShell
      back={{ href: '/admin/cofre', label: 'Cofre' }}
      title={data.title || 'Nova página do cofre'}
      status={<StatusPill published={published} />}
      viewHref={original && published ? `/cofre/${original}` : null}
      dirty={dirty}
      onSave={() => saveCofre({ ...data }, original)}
      onSaved={(r) => {
        markSaved()
        if (r.slug && r.slug !== original) {
          setOriginal(r.slug)
          router.replace(`/admin/cofre/${r.slug}`)
        }
      }}
      onDelete={
        original
          ? async () => {
              const r = await deleteCofre(original)
              if (r.ok) router.push('/admin/cofre')
              return r
            }
          : undefined
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
        <div className="flex flex-col gap-4 min-w-0">
          <input value={data.title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (ex.: Central de Repositórios Secretos)" className={titleInput} autoFocus={isNew} />
          <TextArea value={data.summary} onChange={(v) => set('summary', v)} placeholder="Resumo curto: aparece no card do cofre e na prévia do link" minRows={2} />

          {isVideo && (
            <Card title="Vídeo" hint="Envie o arquivo ou cole o link do Reel/YouTube. Sem vídeo, o bloco leva pro seu Instagram.">
              <MediaField value={data.video_url ?? ''} onChange={(v) => set('video_url', v || null)} accept="video/*" />
            </Card>
          )}

          <MarkdownEditor value={data.body_md} onChange={(v) => set('body_md', v)} placeholder="Conteúdo da página: links, passo a passo, fotos, avisos…" minHeight={420} />

          {isVideo && (
            <>
              <Card title="Materiais do vídeo" hint="Aparecem na lateral da página, com link.">
                <ObjectListField
                  value={data.materials.map((m) => ({ label: m.label, sub: m.sub ?? '', url: m.url ?? '' }))}
                  onChange={(v) => set('materials', v)}
                  fields={[
                    { key: 'label', label: 'Nome', placeholder: 'Repositório do coletor' },
                    { key: 'sub', label: 'Detalhe', placeholder: 'GitHub · C#' },
                    { key: 'url', label: 'Link', placeholder: 'https://…', wide: true },
                  ]}
                  addLabel="Adicionar material"
                />
              </Card>
              <Card title="Capítulos" hint="Opcional. Minuto e assunto.">
                <ObjectListField
                  value={data.chapters.map((c) => ({ t: c.t, label: c.label }))}
                  onChange={(v) => set('chapters', v)}
                  fields={[
                    { key: 't', label: 'Tempo', placeholder: '01:42' },
                    { key: 'label', label: 'Assunto', placeholder: 'Escolhendo as fontes' },
                  ]}
                  addLabel="Adicionar capítulo"
                />
              </Card>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card>
            <Toggle checked={published} onChange={(v) => set('published', v)} label={published ? 'Publicado' : 'Rascunho'} hint={published ? 'Visível no cofre' : 'Só você vê'} />
            <Field label="Tipo">
              <Select value={data.category} onChange={(v) => set('category', v)} options={cofreCategories} />
            </Field>
            <Field label="Tema" hint="Agrupa itens parecidos (ex.: IA no seu computador)">
              <input
                list="cofre-topics"
                value={data.topic ?? ''}
                onChange={(e) => set('topic', e.target.value || null)}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base sm:text-[15px] outline-none focus:border-ink"
              />
              <datalist id="cofre-topics">
                {topics.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>
            <SlugField
              prefix="/cofre/"
              value={data.slug}
              onChange={(v) => {
                setSlugTouched(true)
                set('slug', v)
              }}
            />
            <Field label="Palavra-chave da DM" hint="Quem comentar essa palavra recebe o link (automação futura).">
              <TextInput value={data.keyword ?? ''} onChange={(v) => set('keyword', v.toUpperCase() || null)} placeholder="REPOS" />
            </Field>
            <DateField value={data.published_at} onChange={(v) => set('published_at', v)} />
            <Field label="Cor do card">
              <TonePicker value={data.tone} onChange={(v) => set('tone', v)} />
            </Field>
          </Card>
          <Card title={isVideo ? 'Thumbnail do vídeo' : 'Imagem de capa'} hint={isVideo ? 'Print do Reel. Aparece no card da grade do cofre.' : 'Opcional. Aparece no topo da página.'}>
            <MediaField value={data.cover_url ?? ''} onChange={(v) => set('cover_url', v || null)} />
          </Card>
        </div>
      </div>
    </EditorShell>
  )
}
