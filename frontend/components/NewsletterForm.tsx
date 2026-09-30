'use client'

import { useActionState } from 'react'
import { subscribe, type SubscribeState } from '@/app/actions'

const initial: SubscribeState = { status: 'idle', message: '' }

interface NewsletterFormProps {
  variant?: 'pill' | 'block'
  ctaLabel?: string
}

export default function NewsletterForm({ variant = 'pill', ctaLabel = 'Assinar' }: NewsletterFormProps) {
  const [state, action, pending] = useActionState(subscribe, initial)

  if (state.status === 'ok') {
    return variant === 'pill' ? (
      <div className="bg-surface rounded-3xl px-6 py-5">
        <div className="font-serif text-[26px]">{state.message}</div>
        <div className="text-muted mt-1.5">A próxima carta chega sexta às 7h.</div>
      </div>
    ) : (
      <div className="inline-block bg-mint rounded-3xl px-6 py-4.5">
        <span className="font-serif text-[26px]">{state.message}</span>
      </div>
    )
  }

  return (
    <form action={action} className={variant === 'pill' ? 'flex flex-wrap gap-2 bg-surface rounded-full p-1.5' : 'flex flex-wrap gap-2 bg-surface border border-line rounded-full p-1.5 shadow-[0_20px_40px_-28px_rgba(30,28,25,.4)]'}>
      <input
        name="email"
        type="email"
        required
        placeholder="seu@email.com"
        className="flex-1 min-w-0 border-0 outline-none bg-transparent px-3.5 py-2.5 text-base sm:text-[15px]"
      />
      <button
        type="submit"
        disabled={pending}
        className="whitespace-nowrap px-4.5 py-2.5 rounded-full bg-ink text-surface font-medium text-[14.5px] disabled:opacity-60 cursor-pointer"
      >
        {pending ? '...' : ctaLabel}
      </button>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.status === 'error' && <p role="alert" className="w-full text-sm text-hand px-4">{state.message}</p>}
    </form>
  )
}
