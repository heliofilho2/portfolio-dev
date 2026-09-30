'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { deleteMedia, listMedia } from '@/app/admin/actions'
import type { MediaFile } from '@/lib/adminStore'
import { btn } from './ui'
import { uploadFile } from './upload'

const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

// Grade de mídia com envio. Usada na página Mídia (manage) e como seletor dentro dos editores (onPick).
export function MediaGrid({ onPick, accept = 'image/*,video/*', manage = false }: { onPick?: (url: string, file: MediaFile) => void; accept?: string; manage?: boolean }) {
  const [files, setFiles] = useState<MediaFile[] | null>(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const input = useRef<HTMLInputElement>(null)

  const refresh = useCallback(() => {
    listMedia()
      .then(setFiles)
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(refresh, [refresh])

  async function send(list: FileList | null) {
    if (!list?.length) return
    setError('')
    try {
      for (const f of Array.from(list)) {
        setBusy(`Enviando ${f.name}…`)
        await uploadFile(f)
      }
      refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy('')
    }
  }

  const visible = (files ?? []).filter((f) => (accept.startsWith('image') && !accept.includes('video') ? f.type === 'image' : true))

  return (
    <div
      className="flex flex-col gap-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        send(e.dataTransfer.files)
      }}
    >
      <div className="flex gap-2 items-center flex-wrap">
        <button type="button" className={btn.primary} onClick={() => input.current?.click()} disabled={!!busy}>
          ↑ Enviar arquivo
        </button>
        <span className="text-[13px] text-subtle">{busy || 'ou arraste fotos e vídeos pra cá (até 50MB)'}</span>
        <input ref={input} type="file" accept={accept} multiple className="hidden" onChange={(e) => send(e.target.files)} />
      </div>
      {error && <p className="text-[13.5px] text-[#B4453A]">{error}</p>}
      {files === null ? (
        <p className="text-sm text-subtle py-6">Carregando…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-subtle py-6">Nenhum arquivo ainda.</p>
      ) : (
        <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((f) => (
            <div key={f.name} className="group relative rounded-2xl overflow-hidden border border-line bg-bg">
              <button type="button" onClick={() => onPick?.(f.url, f)} className={`block w-full aspect-square ${onPick ? 'cursor-pointer' : 'cursor-default'}`}>
                {f.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                ) : f.type === 'video' ? (
                  <video src={f.url} muted preload="metadata" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center font-mono text-xs text-subtle">arquivo</span>
                )}
                {f.type === 'video' && <span className="absolute top-2 left-2 font-mono text-[10px] bg-ink text-surface px-2 py-0.5 rounded-full">vídeo</span>}
              </button>
              <div className="px-2.5 py-2 flex items-center gap-2 bg-surface border-t border-line">
                <span className="flex-1 min-w-0 truncate text-[12px] text-muted" title={f.name}>
                  {fmtSize(f.size)}
                </span>
                {manage && (
                  <>
                    <button
                      type="button"
                      className="text-[12px] font-medium text-accent cursor-pointer"
                      onClick={() => {
                        navigator.clipboard?.writeText(f.url.startsWith('/') ? location.origin + f.url : f.url)
                        setCopied(f.name)
                        setTimeout(() => setCopied(''), 1500)
                      }}
                    >
                      {copied === f.name ? 'Copiado ✓' : 'Copiar link'}
                    </button>
                    <button
                      type="button"
                      className="text-[12px] text-[#B4453A] cursor-pointer"
                      onClick={async () => {
                        if (!confirm('Apagar este arquivo? Páginas que usam ele vão ficar sem a imagem.')) return
                        const r = await deleteMedia(f.name)
                        if (!r.ok) setError(r.error)
                        refresh()
                      }}
                    >
                      Apagar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function MediaPickerModal({ open, onClose, onPick, accept }: { open: boolean; onClose: () => void; onPick: (url: string) => void; accept?: string }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6" onClick={onClose}>
      <div className="bg-surface w-full sm:max-w-3xl max-h-[88vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-[26px]">Biblioteca de mídia</h2>
          <button type="button" className={btn.small} onClick={onClose}>
            ×
          </button>
        </div>
        <MediaGrid
          accept={accept}
          onPick={(url) => {
            onPick(url)
            onClose()
          }}
        />
      </div>
    </div>
  )
}
