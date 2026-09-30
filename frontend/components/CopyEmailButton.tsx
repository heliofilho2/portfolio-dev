'use client'

import { useState } from 'react'

export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(email).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="flex items-center max-w-full border border-ink rounded-full overflow-hidden">
      <span className="min-w-0 truncate px-3.5 py-2 font-mono text-[12px] sm:text-[12.5px]">{email}</span>
      <button
        onClick={copy}
        className="shrink-0 px-3.5 py-2 font-mono text-[11px] tracking-[0.1em] uppercase bg-ink text-surface whitespace-nowrap cursor-pointer"
      >
        {copied ? 'Copiado ✓' : 'Copiar'}
      </button>
    </div>
  )
}
