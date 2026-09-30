'use client'

import { useState } from 'react'

const substackUrl = 'https://heliofilhou.substack.com'

// Mesma newsletter do site pessoal: inscrição direto no Substack (POST do embed oficial).
// A confirmação do Substack abre em outra aba e o leitor continua no jornal.
export default function SubscribeBox() {
  const [sent, setSent] = useState(false)

  if (sent) return <div className="mt-2.5 italic">Quase lá! Confirme no seu e-mail.</div>

  return (
    <form
      action={`${substackUrl}/api/v1/free?nojs=true`}
      method="post"
      target="_blank"
      onSubmit={() => setTimeout(() => setSent(true), 50)}
      className="flex gap-1.5 mt-2.5"
    >
      <input type="hidden" name="source" value="embed" />
      <input
        name="email"
        type="email"
        required
        placeholder="seu@email.com"
        aria-label="Seu e-mail"
        className="flex-1 min-w-0 border-0 border-b border-ink bg-transparent outline-none px-0.5 py-1.5 text-base sm:text-sm no-underline"
      />
      <button type="submit" className="px-3 py-1.5 bg-ink text-paper rounded-full font-mono text-xs tracking-[0.12em] uppercase no-underline cursor-pointer">
        Assinar
      </button>
    </form>
  )
}
