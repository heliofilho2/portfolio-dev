'use client'

import { useRef, useState } from 'react'
import Markdown from '@/components/Markdown'
import { MediaPickerModal } from './MediaPicker'
import { isVideoUrl, uploadFile } from './upload'

type Mode = 'write' | 'preview' | 'split'

// Editor de texto do blog, cofre e README: barra de formatação, prévia igual ao site e
// foto/vídeo por botão, arrastar ou colar (Ctrl+V). Por baixo é markdown, mas não precisa saber.
export default function MarkdownEditor({ value, onChange, placeholder, minHeight = 360 }: { value: string; onChange: (v: string) => void; placeholder?: string; minHeight?: number }) {
  const ta = useRef<HTMLTextAreaElement>(null)
  const file = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>('write')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [picker, setPicker] = useState(false)

  // Aplica uma edição na seleção atual e devolve o cursor pro lugar certo.
  function edit(fn: (selected: string) => { text: string; select?: [number, number] }) {
    const el = ta.current
    if (!el) {
      // Modo prévia: sem textarea na tela, acrescenta no fim.
      onChange(value + fn('').text)
      return
    }
    const { selectionStart: s, selectionEnd: e } = el
    const { text, select } = fn(value.slice(s, e))
    onChange(value.slice(0, s) + text + value.slice(e))
    requestAnimationFrame(() => {
      el.focus()
      const [a, b] = select ?? [text.length, text.length]
      el.setSelectionRange(s + a, s + b)
    })
  }

  const wrap = (before: string, after: string, fallback: string) =>
    edit((sel) => {
      const inner = sel || fallback
      return { text: before + inner + after, select: [before.length, before.length + inner.length] }
    })

  const block = (prefix: string, fallback: string) =>
    edit((sel) => {
      const lines = (sel || fallback).split('\n').map((l, i) => (prefix === '1. ' ? `${i + 1}. ` : prefix) + l)
      const text = `\n${lines.join('\n')}\n`
      return { text, select: [1 + (prefix === '1. ' ? 3 : prefix.length), text.length - 1] }
    })

  const insertMedia = (urls: string[], alt = '') =>
    edit(() => ({ text: urls.map((url) => `\n\n![${alt || (isVideoUrl(url) ? 'vídeo' : '')}](${url})`).join('') + '\n\n' }))

  async function send(files: FileList | File[] | null) {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))
    if (!list.length) return
    setError('')
    const urls: string[] = []
    try {
      for (const f of list) {
        setBusy(`Enviando ${f.name}…`)
        urls.push(await uploadFile(f))
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      // Insere tudo de uma vez: o texto só muda depois do último envio.
      if (urls.length) insertMedia(urls)
      setBusy('')
    }
  }

  const tools: { label: string; title: string; run: () => void; className?: string }[] = [
    { label: 'B', title: 'Negrito', run: () => wrap('**', '**', 'texto'), className: 'font-bold' },
    { label: 'I', title: 'Itálico', run: () => wrap('*', '*', 'texto'), className: 'italic font-serif text-[16px]' },
    { label: 'Título', title: 'Título de seção', run: () => block('## ', 'Título') },
    { label: 'Sub', title: 'Subtítulo', run: () => block('### ', 'Subtítulo') },
    { label: '• Lista', title: 'Lista', run: () => block('- ', 'item') },
    { label: '1. Lista', title: 'Lista numerada', run: () => block('1. ', 'item') },
    { label: '❝ Destaque', title: 'Caixa de destaque', run: () => block('> ', 'texto em destaque') },
    { label: '</>', title: 'Código', run: () => wrap('`', '`', 'código'), className: 'font-mono text-[12px]' },
    {
      label: '🔗 Link',
      title: 'Link',
      run: () => {
        const url = prompt('Cole o link (https://…)')
        if (url) wrap('[', `](${url})`, 'texto do link')
      },
    },
  ]

  const toolBtn = 'shrink-0 h-8 px-2.5 rounded-lg text-[13px] text-ink-2 hover:bg-chip hover:text-ink cursor-pointer whitespace-nowrap'
  const modeBtn = (m: Mode) => `px-2.5 py-1 rounded-full text-[12.5px] font-medium cursor-pointer ${mode === m ? 'bg-ink text-surface' : 'text-muted hover:text-ink'}`

  return (
    <div className="rounded-[18px] border border-line bg-surface overflow-hidden focus-within:border-ink transition-colors">
      <div className="flex items-center gap-x-1 gap-y-1.5 px-2 py-1.5 border-b border-line bg-bg/60 flex-wrap">
        {/* Mídia primeiro: é o que mais se usa. No celular a barra rola; no desktop quebra linha. */}
        <div className="flex gap-0.5 overflow-x-auto no-scrollbar sm:flex-wrap sm:overflow-visible flex-1 min-w-0">
          <button type="button" className={`${toolBtn} bg-lilac/70 font-medium`} onClick={() => file.current?.click()} title="Enviar foto ou vídeo">
            🖼 Foto/vídeo
          </button>
          <button type="button" className={toolBtn} onClick={() => setPicker(true)} title="Escolher da biblioteca">
            Biblioteca
          </button>
          <button
            type="button"
            className={toolBtn}
            title="Vídeo do YouTube ou Instagram"
            onClick={() => {
              const url = prompt('Link do vídeo no YouTube ou Instagram')
              if (url) insertMedia([url], 'vídeo')
            }}
          >
            ▶ YouTube/Insta
          </button>
          <span className="w-px h-5 bg-line mx-1 self-center shrink-0" />
          {tools.map((t) => (
            <button key={t.title} type="button" title={t.title} onClick={t.run} className={`${toolBtn} ${t.className ?? ''}`} disabled={mode === 'preview'}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-0.5 shrink-0 bg-chip rounded-full p-0.5 ml-auto">
          <button type="button" className={modeBtn('write')} onClick={() => setMode('write')}>
            Escrever
          </button>
          <button type="button" className={`${modeBtn('split')} hidden lg:block`} onClick={() => setMode('split')}>
            Lado a lado
          </button>
          <button type="button" className={modeBtn('preview')} onClick={() => setMode('preview')}>
            Prévia
          </button>
        </div>
      </div>

      <div className={mode === 'split' ? 'grid lg:grid-cols-2 lg:divide-x divide-line' : ''}>
        {mode !== 'preview' && (
          <textarea
            ref={ta}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onPaste={(e) => {
              if (e.clipboardData.files.length) {
                e.preventDefault()
                send(e.clipboardData.files)
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.files.length) {
                e.preventDefault()
                send(e.dataTransfer.files)
              }
            }}
            style={{ minHeight }}
            className="block w-full resize-y bg-transparent px-4 py-3.5 outline-none font-mono text-[14px] leading-[1.7] text-ink placeholder:text-subtle placeholder:font-sans"
          />
        )}
        {mode !== 'write' && (
          <div className="px-4 sm:px-6 py-4 overflow-y-auto" style={{ minHeight, maxHeight: mode === 'split' ? 720 : undefined }}>
            {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-subtle text-sm">Nada escrito ainda.</p>}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3 px-4 py-2 border-t border-line text-[12px] text-subtle">
        <span className={error ? 'text-[#B4453A]' : ''}>{error || busy || 'Arraste ou cole fotos e vídeos direto no texto.'}</span>
        <span className="shrink-0">{value.trim() ? value.trim().split(/\s+/).length : 0} palavras</span>
      </div>

      <input ref={file} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => send(e.target.files)} />
      <MediaPickerModal open={picker} onClose={() => setPicker(false)} onPick={(url) => insertMedia([url])} />
    </div>
  )
}
