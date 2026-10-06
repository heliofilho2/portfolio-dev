'use client'

import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { tones, toneBg, type Tone } from '@/lib/contentModel'

// Peças básicas do /admin, no mesmo visual do site.

import { btn } from './styles'

export { btn }

const inputBase = 'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base sm:text-[15px] outline-none transition-colors focus:border-ink placeholder:text-subtle'

export function Card({ title, hint, children, className = '' }: { title?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`bg-surface border border-line rounded-[20px] p-4 sm:p-5 ${className}`}>
      {title && <h2 className="font-serif text-[22px] leading-tight">{title}</h2>}
      {hint && <p className="text-[13.5px] text-muted mt-0.5">{hint}</p>}
      <div className={`flex flex-col gap-4 ${title || hint ? 'mt-4' : ''}`}>{children}</div>
    </section>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-subtle">{label}</span>
      {children}
      {hint && <span className="text-[12.5px] text-subtle leading-snug">{hint}</span>}
    </label>
  )
}

export function TextInput({ value, onChange, placeholder, type = 'text', className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputBase} ${className}`} />
}

// Textarea que cresce com o texto.
export function TextArea({ value, onChange, placeholder, minRows = 3, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; minRows?: number; className?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }, [value])
  return <textarea ref={ref} rows={minRows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputBase} resize-none leading-relaxed ${className}`} />
}

export function Select<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: readonly T[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)} className={`${inputBase} cursor-pointer`}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-left cursor-pointer group">
      <span className={`relative w-11 h-6.5 rounded-full transition-colors shrink-0 ${checked ? 'bg-online' : 'bg-line'}`}>
        <span className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-surface shadow transition-all ${checked ? 'left-[19px]' : 'left-0.5'}`} />
      </span>
      <span className="flex flex-col">
        <span className="text-[15px] font-medium">{label}</span>
        {hint && <span className="text-[12.5px] text-subtle">{hint}</span>}
      </span>
    </button>
  )
}

export function TonePicker({ value, onChange }: { value: Tone; onChange: (v: Tone) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tones.map((t) => (
        <button
          key={t}
          type="button"
          title={t}
          onClick={() => onChange(t)}
          className={`w-8 h-8 rounded-full ${toneBg[t]} cursor-pointer transition-transform hover:scale-110 ${value === t ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface' : 'border border-black/5'}`}
        />
      ))}
    </div>
  )
}

function moveItem<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

// Arrastar pra reordenar, em vez de só clicar em setinha item por item - usado por
// StringListField e ObjectListField. dropIndex é só feedback visual (linha de destino);
// quem decide a ordem final é sempre moveItem, no drop.
function useDragReorder<T>(value: T[], onChange: (v: T[]) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  return {
    dropTarget: overIndex,
    handlers: (i: number) => ({
      draggable: true,
      onDragStart: () => setDragIndex(i),
      onDragOver: (e: DragEvent) => {
        e.preventDefault()
        if (overIndex !== i) setOverIndex(i)
      },
      onDragEnd: () => {
        setDragIndex(null)
        setOverIndex(null)
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault()
        if (dragIndex !== null && dragIndex !== i) onChange(moveItem(value, dragIndex, i))
        setDragIndex(null)
        setOverIndex(null)
      },
    }),
  }
}

function DragHandle() {
  return (
    <span className="cursor-grab active:cursor-grabbing text-subtle select-none px-0.5" title="Arrastar pra reordenar">
      ⠿
    </span>
  )
}

// Lista de textos (decisões, stack, arquitetura...). Enter adiciona o próximo.
export function StringListField({
  value,
  onChange,
  placeholder,
  addLabel = 'Adicionar',
  max,
}: {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  addLabel?: string
  max?: number
}) {
  const { dropTarget, handlers } = useDragReorder(value, onChange)
  const atMax = max !== undefined && value.length >= max
  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div key={i} className={`flex gap-1.5 items-center rounded-lg ${dropTarget === i ? 'outline outline-2 outline-accent' : ''}`} {...handlers(i)}>
          <DragHandle />
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const row = e.currentTarget.parentElement
                onChange([...value.slice(0, i + 1), '', ...value.slice(i + 1)])
                setTimeout(() => row?.nextElementSibling?.querySelector('input')?.focus())
              }
            }}
            className={`${inputBase} py-2`}
          />
          <button type="button" className={btn.small} onClick={() => onChange(moveItem(value, i, i - 1))} disabled={i === 0} title="Subir">
            ↑
          </button>
          <button type="button" className={btn.small} onClick={() => onChange(value.filter((_, j) => j !== i))} title="Remover">
            ×
          </button>
        </div>
      ))}
      {atMax ? (
        <span className="text-[12.5px] text-subtle">Máximo de {max} itens.</span>
      ) : (
        <button type="button" className={`${btn.ghost} self-start`} onClick={() => onChange([...value, ''])}>
          + {addLabel}
        </button>
      )}
    </div>
  )
}

export interface ObjectFieldSpec<K extends string> {
  key: K
  label: string
  placeholder?: string
  kind?: 'text' | 'tone' | 'media'
  wide?: boolean
}

// Lista de itens com vários campos (redes, reels, trajetória, materiais...).
export function ObjectListField<K extends string>({
  value,
  onChange,
  fields,
  addLabel = 'Adicionar',
  renderMedia,
  max,
}: {
  value: Record<K, string>[]
  onChange: (v: Record<K, string>[]) => void
  fields: ObjectFieldSpec<K>[]
  addLabel?: string
  renderMedia?: (value: string, onChange: (v: string) => void) => ReactNode
  max?: number
}) {
  const blank = Object.fromEntries(fields.map((f) => [f.key, f.kind === 'tone' ? 'lilac' : ''])) as Record<K, string>
  const set = (i: number, k: K, v: string) => onChange(value.map((row, j) => (j === i ? { ...row, [k]: v } : row)))
  const { dropTarget, handlers } = useDragReorder(value, onChange)
  const atMax = max !== undefined && value.length >= max
  return (
    <div className="flex flex-col gap-2.5">
      {value.map((row, i) => (
        <div
          key={i}
          className={`rounded-2xl border border-line bg-bg p-3 flex flex-col gap-2.5 ${dropTarget === i ? 'outline outline-2 outline-accent' : ''}`}
          {...handlers(i)}
        >
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-subtle">
              <DragHandle />#{i + 1}
            </span>
            <span className="flex gap-1.5">
              <button type="button" className={btn.small} onClick={() => onChange(moveItem(value, i, i - 1))} disabled={i === 0} title="Subir">
                ↑
              </button>
              <button type="button" className={btn.small} onClick={() => onChange(moveItem(value, i, i + 1))} disabled={i === value.length - 1} title="Descer">
                ↓
              </button>
              <button type="button" className={btn.small} onClick={() => onChange(value.filter((_, j) => j !== i))} title="Remover">
                ×
              </button>
            </span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.wide || f.kind === 'media' ? 'sm:col-span-2' : ''}>
                <Field label={f.label}>
                  {f.kind === 'tone' ? (
                    <TonePicker value={(row[f.key] as Tone) || 'lilac'} onChange={(v) => set(i, f.key, v)} />
                  ) : f.kind === 'media' && renderMedia ? (
                    renderMedia(row[f.key] ?? '', (v) => set(i, f.key, v))
                  ) : (
                    <TextInput value={row[f.key] ?? ''} onChange={(v) => set(i, f.key, v)} placeholder={f.placeholder} />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </div>
      ))}
      {atMax ? (
        <span className="text-[12.5px] text-subtle">Máximo de {max} itens - é só o que aparece na home.</span>
      ) : (
        <button type="button" className={`${btn.ghost} self-start`} onClick={() => onChange([...value, { ...blank }])}>
          + {addLabel}
        </button>
      )}
    </div>
  )
}

export function Notice({ tone = 'butter', children }: { tone?: 'butter' | 'rose' | 'mint'; children: ReactNode }) {
  return <div className={`${toneBg[tone]} rounded-2xl px-4 py-3 text-[14px] leading-snug`}>{children}</div>
}
