'use client'

import { useState } from 'react'
import { substackUrl } from '@/lib/socials'

interface NewsletterFormProps {
  variant?: 'pill' | 'block'
  ctaLabel?: string
}

// Inscrição vai direto pro Substack: mesmo POST do embed oficial (/api/v1/free?nojs=true).
// A confirmação do Substack abre em outra aba e o leitor continua no site.
export default function NewsletterForm({ variant = 'pill', ctaLabel = 'Assinar' }: NewsletterFormProps) {
  const [sent, setSent] = useState(false)

  if (sent) {
    return variant === 'pill' ? (
      <div className="bg-surface rounded-3xl px-6 py-5">
        <div className="font-serif text-[26px]">Quase lá!</div>
        <div className="text-muted mt-1">Confirme no e-mail que o Substack acabou de te mandar.</div>
      </div>
    ) : (
      <div className="inline-block bg-mint rounded-3xl px-6 py-4.5">
        <span className="font-serif text-[24px]">Quase lá! Confirme no seu e-mail.</span>
      </div>
    )
  }

  return (
    <form
      action={`${substackUrl}/api/v1/free?nojs=true`}
      method="post"
      target="_blank"
      onSubmit={() => setTimeout(() => setSent(true), 50)}
      className={
        variant === 'pill'
          ? 'flex gap-2 bg-surface rounded-full p-1.5'
          : 'flex gap-2 bg-surface border border-line rounded-full p-1.5 shadow-[0_20px_40px_-28px_rgba(30,28,25,.4)]'
      }
    >
      <input type="hidden" name="source" value="embed" />
      <input
        name="email"
        type="email"
        required
        placeholder="seu@email.com"
        aria-label="Seu e-mail"
        className="flex-1 min-w-0 border-0 outline-none bg-transparent px-3.5 py-2.5 text-base sm:text-[15px]"
      />
      <button type="submit" className="whitespace-nowrap px-4.5 py-2.5 rounded-full bg-ink text-surface font-medium text-[14.5px] cursor-pointer">
        {ctaLabel}
      </button>
    </form>
  )
}
