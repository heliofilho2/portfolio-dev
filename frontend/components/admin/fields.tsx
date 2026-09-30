'use client'

import { Field } from './ui'

// Campos que se repetem entre os editores.

export function SlugField({ prefix, value, onChange }: { prefix: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label="Link" hint="Curto e sem acento. É o link que você manda na DM.">
      <div className="flex items-center rounded-xl border border-line bg-surface focus-within:border-ink overflow-hidden">
        <span className="pl-3 text-[13px] text-subtle whitespace-nowrap">{prefix}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          className="flex-1 min-w-0 bg-transparent py-2.5 pr-3 text-base sm:text-[14px] outline-none font-mono"
        />
      </div>
    </Field>
  )
}

export function DateField({ value, onChange, label = 'Data' }: { value: string; onChange: (iso: string) => void; label?: string }) {
  return (
    <Field label={label}>
      <input
        type="date"
        value={value.slice(0, 10)}
        onChange={(e) => e.target.value && onChange(`${e.target.value}T12:00:00.000Z`)}
        className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base sm:text-[15px] outline-none focus:border-ink"
      />
    </Field>
  )
}

export function StatusPill({ published }: { published: boolean }) {
  return (
    <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${published ? 'bg-mint' : 'bg-chip text-muted'}`}>
      {published ? 'Publicado' : 'Rascunho'}
    </span>
  )
}

export const titleInput =
  'w-full bg-transparent outline-none font-serif text-[clamp(32px,4.5vw,46px)] leading-[1.05] tracking-[-0.02em] placeholder:text-line border-b border-transparent focus:border-line pb-1'
