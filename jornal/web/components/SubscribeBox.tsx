'use client'

import { useActionState } from 'react'
import { subscribe, type SubscribeState } from '@/app/actions'

const initial: SubscribeState = { status: 'idle', message: '' }

export default function SubscribeBox() {
  const [state, action, pending] = useActionState(subscribe, initial)

  if (state.status === 'ok') return <div className="mt-2.5 italic">{state.message}</div>

  return (
    <form action={action} className="flex gap-1.5 mt-2.5">
      <input
        name="email"
        type="email"
        required
        placeholder="seu@email.com"
        className="flex-1 min-w-0 border-0 border-b border-ink bg-transparent outline-none px-0.5 py-1.5 text-base sm:text-sm no-underline"
      />
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-1.5 bg-ink text-paper rounded-full font-mono text-xs tracking-[0.12em] uppercase no-underline disabled:opacity-60 cursor-pointer"
      >
        {pending ? '...' : 'Assinar'}
      </button>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.status === 'error' && <p role="alert" className="w-full text-xs text-red mt-1">{state.message}</p>}
    </form>
  )
}
