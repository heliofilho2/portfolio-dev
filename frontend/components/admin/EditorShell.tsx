'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { ActionResult } from '@/app/admin/actions'
import { btn } from './ui'

// Estado de um formulário do admin: guarda o valor salvo pra saber se tem mudança pendente.
export function useDraft<T>(initial: T) {
  const [data, setData] = useState(initial)
  const [saved, setSaved] = useState(() => JSON.stringify(initial))
  const set = <K extends keyof T>(key: K, value: T[K]) => setData((d) => ({ ...d, [key]: value }))
  return { data, setData, set, dirty: JSON.stringify(data) !== saved, markSaved: () => setSaved(JSON.stringify(data)) }
}

export function Toast({ message, error, onDone }: { message: string; error?: boolean; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, error ? 6000 : 2500)
    return () => clearTimeout(t)
  }, [message, error, onDone])
  return (
    <div
      role="status"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4.5 py-3 rounded-full text-sm font-medium shadow-[0_16px_40px_-16px_rgba(30,28,25,.5)] max-w-[92vw] ${
        error ? 'bg-[#B4453A] text-surface' : 'bg-ink text-surface'
      }`}
    >
      {message}
    </div>
  )
}

export default function EditorShell({
  back,
  title,
  status,
  viewHref,
  dirty,
  onSave,
  onSaved,
  onDelete,
  children,
}: {
  back: { href: string; label: string }
  title: string
  status?: ReactNode
  viewHref?: string | null
  dirty: boolean
  onSave: () => Promise<ActionResult>
  onSaved?: (r: Extract<ActionResult, { ok: true }>) => void
  onDelete?: () => Promise<ActionResult>
  children: ReactNode
}) {
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null)
  const saveRef = useRef<() => void>(() => {})
  const clearToast = useCallback(() => setToast(null), [])

  async function save() {
    if (saving) return
    setSaving(true)
    const r = await onSave()
    setSaving(false)
    if (r.ok) {
      setToast({ message: 'Salvo ✓ Já está no site.' })
      onSaved?.(r)
    } else setToast({ message: r.error, error: true })
  }

  useEffect(() => {
    saveRef.current = save
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-bg/90 backdrop-blur-md border-b border-line flex items-center gap-3 flex-wrap">
        <Link href={back.href} className="font-mono text-[11px] tracking-[0.1em] uppercase text-subtle hover:text-ink shrink-0">
          ← {back.label}
        </Link>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="font-serif text-[20px] leading-tight truncate">{title}</span>
          {status}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          {dirty && <span className="hidden sm:inline text-[12.5px] text-subtle mr-1">não salvo</span>}
          {viewHref && (
            <a href={viewHref} target="_blank" rel="noopener noreferrer" className={btn.ghost}>
              Ver no site ↗
            </a>
          )}
          <button type="button" onClick={save} disabled={saving} className={btn.primary} title="Ctrl+S">
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="mt-5">{children}</div>

      {onDelete && (
        <div className="mt-10 pt-5 border-t border-line flex justify-end">
          <button
            type="button"
            className={btn.danger}
            onClick={async () => {
              if (!confirm('Excluir de vez? Não dá pra desfazer.')) return
              const r = await onDelete()
              if (!r.ok) setToast({ message: r.error, error: true })
            }}
          >
            Excluir
          </button>
        </div>
      )}

      {toast && <Toast {...toast} onDone={clearToast} />}
    </div>
  )
}
