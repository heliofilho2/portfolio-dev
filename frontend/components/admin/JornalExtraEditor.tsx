'use client'

import { useState } from 'react'
import { saveJornalExtra } from '@/app/admin/actions'
import type { JornalExtra } from '@/lib/contentModel'
import { Toast, useDraft } from './EditorShell'
import MediaField from './MediaField'
import { Card, Field, StringListField, TextArea, TextInput, btn } from './ui'

const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date(`${iso}T12:00:00`))

// Só a edição de "hoje" - o Jornal mostra sempre a linha com date = hoje (ver jornal/web/lib/data.ts).
// Sem lista, sem histórico: amanhã essa mesma tela carrega o dia seguinte, em branco.
export default function JornalExtraEditor({ extra }: { extra: JornalExtra }) {
  const { data, set, dirty, markSaved } = useDraft(extra)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null)

  async function save() {
    setSaving(true)
    const r = await saveJornalExtra({ ...data })
    setSaving(false)
    if (r.ok) {
      setToast({ message: 'Salvo ✓ Já está no Jornal.' })
      markSaved()
    } else setToast({ message: r.error, error: true })
  }

  return (
    <div className="max-w-[640px] flex flex-col gap-4 pb-20">
      <div>
        <h1 className="font-serif text-[28px] leading-tight capitalize">{dateLabel(data.date)}</h1>
        <p className="text-[13.5px] text-muted mt-0.5">Charge e pergunta do dia pra edição de hoje do Jornal Tech. Fica em branco até você preencher.</p>
      </div>

      <Card title="Charge do dia" hint="Print ou foto do desenho. Aparece no box 'A charge', na lateral da home do Jornal.">
        <MediaField value={data.charge_url ?? ''} onChange={(v) => set('charge_url', v || null)} />
        <Field label="Legenda" hint="Opcional. Aparece embaixo da charge.">
          <TextInput value={data.charge_caption ?? ''} onChange={(v) => set('charge_caption', v || null)} placeholder="por Hélio" />
        </Field>
      </Card>

      <Card title="Pergunta do dia" hint="Uma pergunta sobre a edição de hoje. Sem pergunta cadastrada, o Jornal mostra 'Em breve'.">
        <Field label="Pergunta">
          <TextArea value={data.trivia_question ?? ''} onChange={(v) => set('trivia_question', v || null)} placeholder="Qual empresa lançou o modelo aberto da manchete de hoje?" minRows={2} />
        </Field>
        <Field label="Resposta certa">
          <TextInput value={data.trivia_correct ?? ''} onChange={(v) => set('trivia_correct', v || null)} placeholder="OpenAI" />
        </Field>
        <Field label="Respostas erradas" hint="De 1 a 3. Aparecem junto com a certa, embaralhadas.">
          <StringListField value={data.trivia_wrong} onChange={(v) => set('trivia_wrong', v.slice(0, 3))} placeholder="Google" addLabel="Adicionar alternativa" />
        </Field>
      </Card>

      <div className="flex items-center gap-3 sticky bottom-4">
        <button type="button" onClick={save} disabled={saving} className={btn.primary}>
          {saving ? 'Salvando…' : 'Salvar'}
        </button>
        {dirty && <span className="text-[12.5px] text-subtle">não salvo</span>}
      </div>

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  )
}
