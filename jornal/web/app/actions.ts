'use server'

import { supabase } from '@/lib/news'

export interface SubscribeState {
  status: 'idle' | 'ok' | 'error'
  message: string
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  // Campo invisível: humanos não preenchem, bots sim
  if (formData.get('website')) return { status: 'ok', message: 'Inscrição confirmada.' }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: 'error', message: 'Confira o e-mail digitado.' }
  }
  if (!supabase) return { status: 'error', message: 'Inscrições ainda não estão abertas.' }

  const { error } = await supabase.from('subscribers').insert({ email })
  // 23505 = e-mail já cadastrado; para quem se inscreve, o resultado é o mesmo
  if (error && error.code !== '23505') {
    console.error('[subscribe]', error.message)
    return { status: 'error', message: 'Não foi possível concluir agora. Tente de novo em instantes.' }
  }
  return { status: 'ok', message: 'Inscrição confirmada. Até a próxima edição.' }
}
