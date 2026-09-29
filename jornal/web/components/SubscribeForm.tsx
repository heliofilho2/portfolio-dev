'use client'

import { useActionState } from 'react'
import { subscribe, type SubscribeState } from '@/app/actions'

const initial: SubscribeState = { status: 'idle', message: '' }

export default function SubscribeForm() {
  const [state, action, pending] = useActionState(subscribe, initial)

  if (state.status === 'ok') {
    return <p className="text-sm text-teal font-medium">{state.message}</p>
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <label htmlFor="email" className="text-sm text-ink-2">
        Receba o resumo do SINAL por e-mail.
      </label>
      <div className="flex gap-2">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@email.com"
          className="min-w-0 flex-1 min-h-11 px-3 rounded-[4px] border border-rule bg-card text-sm focus:outline-2 focus:outline-teal"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 px-4 rounded-[4px] bg-ink text-paper text-sm font-medium hover:bg-teal-dark disabled:opacity-60 cursor-pointer"
        >
          {pending ? 'Enviando…' : 'Assinar'}
        </button>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.status === 'error' && (
        <p role="alert" className="text-sm text-rust">
          {state.message}
        </p>
      )}
    </form>
  )
}
