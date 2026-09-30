'use server'

import { supabase } from '@/lib/supabase'

export interface SubscribeState {
  status: 'idle' | 'ok' | 'error'
  message: string
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Mesma tabela `subscribers` usada pelo Jornal (mesmo Supabase): uma lista só.
export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  if (formData.get('website')) return { status: 'ok', message: 'Pronto, tá dentro. ✓' }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: 'error', message: 'Confira o e-mail digitado.' }
  }
  if (!supabase) return { status: 'error', message: 'Inscrições ainda não estão abertas.' }

  const { error } = await supabase.from('subscribers').insert({ email })
  if (error && error.code !== '23505') {
    console.error('[subscribe]', error.message)
    return { status: 'error', message: 'Não foi possível agora. Tenta de novo em instantes.' }
  }
  return { status: 'ok', message: 'Pronto, tá dentro. ✓' }
}
