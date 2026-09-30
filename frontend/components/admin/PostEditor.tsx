'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deletePost, savePost } from '@/app/admin/actions'
import { slugify, type Post } from '@/lib/contentModel'
import EditorShell, { useDraft } from './EditorShell'
import MarkdownEditor from './MarkdownEditor'
import MediaField from './MediaField'
import { DateField, SlugField, StatusPill, titleInput } from './fields'
import { Card, Field, TextArea, TextInput, Toggle } from './ui'

export default function PostEditor({ post, isNew }: { post: Post; isNew: boolean }) {
  const router = useRouter()
  const { data, set, dirty, markSaved } = useDraft(post)
  const [original, setOriginal] = useState<string | null>(isNew ? null : post.slug)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [tags, setTags] = useState(post.tags.join(', '))

  const setTitle = (title: string) => {
    set('title', title)
    if (!slugTouched) set('slug', slugify(title))
  }

  return (
    <EditorShell
      back={{ href: '/admin/posts', label: 'Posts' }}
      title={data.title || 'Novo post'}
      status={<StatusPill published={data.published} />}
      viewHref={original && data.published ? `/blog/${original}` : null}
      dirty={dirty}
      onSave={() => savePost({ ...data }, original)}
      onSaved={(r) => {
        markSaved()
        if (r.slug && r.slug !== original) {
          setOriginal(r.slug)
          router.replace(`/admin/posts/${r.slug}`)
        }
      }}
      onDelete={
        original
          ? async () => {
              const r = await deletePost(original)
              if (r.ok) router.push('/admin/posts')
              return r
            }
          : undefined
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
        <div className="flex flex-col gap-4 min-w-0">
          <input value={data.title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do post" className={titleInput} autoFocus={isNew} />
          <TextArea value={data.summary} onChange={(v) => set('summary', v)} placeholder="Resumo em uma ou duas frases (aparece na lista e no compartilhamento)" minRows={2} />
          <MarkdownEditor value={data.body_md} onChange={(v) => set('body_md', v)} placeholder="Escreva aqui. Use a barra acima pra títulos, listas, fotos e vídeos." minHeight={460} />
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card>
            <Toggle checked={data.published} onChange={(v) => set('published', v)} label={data.published ? 'Publicado' : 'Rascunho'} hint={data.published ? 'Visível no site' : 'Só você vê'} />
            <DateField value={data.published_at} onChange={(v) => set('published_at', v)} />
            <SlugField
              prefix="/blog/"
              value={data.slug}
              onChange={(v) => {
                setSlugTouched(true)
                set('slug', v)
              }}
            />
            <Field label="Tags" hint="Separadas por vírgula">
              <TextInput
                value={tags}
                onChange={(v) => {
                  setTags(v)
                  set('tags', v.split(',').map((t) => t.trim()).filter(Boolean))
                }}
                placeholder="ia, carreira, bastidores"
              />
            </Field>
          </Card>
          <Card title="Capa">
            <MediaField value={data.cover_url ?? ''} onChange={(v) => set('cover_url', v || null)} />
          </Card>
        </div>
      </div>
    </EditorShell>
  )
}
