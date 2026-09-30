'use client'

import { useActionState } from 'react'
import { login } from '../actions'

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: '' })
  return (
    <form action={action} className="flex flex-col gap-3 mt-6">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-subtle">Senha</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      {state.error && <p className="text-[13.5px] text-[#B4453A]">{state.error}</p>}
      <button type="submit" disabled={pending} className="mt-1 px-4 py-3 rounded-full bg-ink text-surface font-medium cursor-pointer disabled:opacity-60">
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
