'use client'

import { useRef, useState } from 'react'
import { MediaPickerModal } from './MediaPicker'
import { btn } from './ui'
import { isVideoUrl, uploadFile } from './upload'

// Campo de foto/vídeo: mostra a prévia e deixa enviar, escolher da biblioteca ou colar um link.
export default function MediaField({ value, onChange, accept = 'image/*', compact = false }: { value: string; onChange: (v: string) => void; accept?: string; compact?: boolean }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [picker, setPicker] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  async function send(file?: File) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onChange(await uploadFile(file))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="flex flex-col gap-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        send(e.dataTransfer.files[0])
      }}
    >
      <div className={`flex gap-3 ${compact ? 'items-center' : 'flex-col'}`}>
        <div
          className={`${compact ? 'w-14 h-14' : 'w-full aspect-video max-h-[240px]'} shrink-0 rounded-2xl overflow-hidden border ${value ? 'border-line' : 'border-dashed border-subtle/50'} bg-bg flex items-center justify-center`}
        >
          {value ? (
            isVideoUrl(value) ? (
              <video src={value} muted preload="metadata" className="w-full h-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <span className="text-[11px] font-mono text-subtle text-center px-2">{busy ? 'enviando…' : compact ? 'vazio' : 'arraste um arquivo aqui'}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex gap-1.5 flex-wrap">
            <button type="button" className={btn.ghost} onClick={() => input.current?.click()} disabled={busy}>
              {busy ? 'Enviando…' : '↑ Enviar'}
            </button>
            <button type="button" className={btn.ghost} onClick={() => setPicker(true)}>
              Biblioteca
            </button>
            {value && (
              <button type="button" className={btn.danger} onClick={() => onChange('')}>
                Remover
              </button>
            )}
          </div>
          {!compact && (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="ou cole um link (https://…)"
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-base sm:text-[13.5px] outline-none focus:border-ink placeholder:text-subtle"
            />
          )}
        </div>
      </div>
      {error && <p className="text-[13px] text-[#B4453A]">{error}</p>}
      <input ref={input} type="file" accept={accept} className="hidden" onChange={(e) => send(e.target.files?.[0])} />
      <MediaPickerModal open={picker} onClose={() => setPicker(false)} onPick={onChange} accept={accept} />
    </div>
  )
}
