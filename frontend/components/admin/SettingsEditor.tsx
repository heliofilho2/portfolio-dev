'use client'

import { saveSettings } from '@/app/admin/actions'
import type { SiteSettings } from '@/lib/settingsModel'
import EditorShell, { useDraft } from './EditorShell'
import MediaField from './MediaField'
import { Card, Field, ObjectListField, StringListField, TextArea, TextInput } from './ui'

const media = (value: string, onChange: (v: string) => void) => <MediaField value={value} onChange={onChange} compact />

export default function SettingsEditor({ settings }: { settings: SiteSettings }) {
  const { data, set, dirty, markSaved } = useDraft(settings)

  return (
    <EditorShell back={{ href: '/admin', label: 'Painel' }} title="Site" viewHref="/" dirty={dirty} onSave={() => saveSettings({ ...data })} onSaved={markSaved}>
      <div className="grid gap-5 lg:grid-cols-2 items-start">
        <div className="flex flex-col gap-5">
          <Card title="Topo da home" hint="Foto, frase escrita à mão e a bio embaixo do seu nome.">
            <Field label="Foto de perfil">
              <MediaField value={data.avatar_url} onChange={(v) => set('avatar_url', v)} />
            </Field>
            <Field label="Frase à mão (acima do nome)">
              <TextInput value={data.hand_note} onChange={(v) => set('hand_note', v)} placeholder="oi! eu sou o" />
            </Field>
            <Field label="Bio">
              <TextArea value={data.bio} onChange={(v) => set('bio', v)} minRows={2} />
            </Field>
            <Field label="E-mail de contato">
              <TextInput value={data.contact_email} onChange={(v) => set('contact_email', v)} type="email" />
            </Field>
          </Card>

          <Card title="Redes" hint="Os botões do topo, os cards de Redes e o rodapé. Seguidores você atualiza aqui.">
            <ObjectListField
              value={data.socials.map((s) => ({ ...s }))}
              onChange={(v) => set('socials', v as SiteSettings['socials'])}
              fields={[
                { key: 'name', label: 'Rede', placeholder: 'Instagram' },
                { key: 'count', label: 'Seguidores', placeholder: '84k' },
                { key: 'handle', label: '@', placeholder: '@heliofilhou' },
                { key: 'url', label: 'Link', placeholder: 'https://…' },
                { key: 'tone', label: 'Cor', kind: 'tone' },
              ]}
              addLabel="Adicionar rede"
            />
          </Card>

          <Card title="Reels da home" hint="Capa, título e link do Reel. Só os 4 primeiros aparecem na home.">
            <ObjectListField
              value={data.reels.map((r) => ({ ...r }))}
              onChange={(v) => set('reels', v as SiteSettings['reels'])}
              fields={[
                { key: 'image_url', label: 'Capa', kind: 'media' },
                { key: 'title', label: 'Título', placeholder: 'O robô que lê 10 sites de IA por mim', wide: true },
                { key: 'url', label: 'Link do Reel', placeholder: 'https://www.instagram.com/reel/…' },
                { key: 'views', label: 'Views', placeholder: '84k' },
                { key: 'tone', label: 'Cor (sem capa)', kind: 'tone' },
              ]}
              renderMedia={media}
              addLabel="Adicionar reel"
              max={4}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Sobre" hint="Página /sobre.">
            <Field label="Foto">
              <MediaField value={data.about_photo_url} onChange={(v) => set('about_photo_url', v)} />
            </Field>
            <Field label="Legenda da foto">
              <TextInput value={data.about_location} onChange={(v) => set('about_location', v)} placeholder="Itajubá, MG" />
            </Field>
            <Field label="Texto" hint="Linha em branco separa parágrafos.">
              <TextArea value={data.about_text} onChange={(v) => set('about_text', v)} minRows={4} />
            </Field>
          </Card>

          <Card title="Agora" hint="Os três cartões coloridos do Sobre.">
            <ObjectListField
              value={data.about_now.map((n) => ({ ...n }))}
              onChange={(v) => set('about_now', v)}
              fields={[
                { key: 'label', label: 'Rótulo', placeholder: 'Construindo' },
                { key: 'text', label: 'Texto', placeholder: 'O Jornal Tech' },
              ]}
              addLabel="Adicionar cartão"
            />
          </Card>

          <Card title="Trajetória">
            <ObjectListField
              value={data.about_timeline.map((t) => ({ ...t }))}
              onChange={(v) => set('about_timeline', v)}
              fields={[
                { key: 'when', label: 'Quando', placeholder: 'desde 2026' },
                { key: 'role', label: 'Cargo · empresa', placeholder: 'Desenvolvedor .NET · RAMO BH' },
                { key: 'desc', label: 'Descrição', wide: true },
              ]}
              addLabel="Adicionar etapa"
            />
          </Card>

          <Card title="Stack do dia a dia">
            <StringListField value={data.about_stack} onChange={(v) => set('about_stack', v)} placeholder="Next.js" />
          </Card>
        </div>
      </div>
    </EditorShell>
  )
}
