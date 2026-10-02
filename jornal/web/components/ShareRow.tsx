'use client'

import { useState } from 'react'

export default function ShareRow({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard pode falhar sem permissão/https - o link já está visível pra copiar na mão
    }
  }

  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] uppercase">
      <span className="text-subtle">Compartilhar</span>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-accent">
        WhatsApp ↗
      </a>
      <button type="button" onClick={copyLink} className="text-accent cursor-pointer">
        {copied ? 'Link copiado ✓' : 'Copiar link'}
      </button>
    </div>
  )
}
