import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { devStoreOn } from './devStore'

// Login do /admin: uma senha (ADMIN_PASSWORD) e um cookie assinado com HMAC que vale 30 dias.
// Sem ADMIN_PASSWORD o painel fica desligado. Exceção: modo local sem Supabase (devStore), senha "admin".
const password = process.env.ADMIN_PASSWORD || (devStoreOn ? 'admin' : '')
const secret = process.env.ADMIN_SECRET || password
const COOKIE = 'hf_admin'
const MAX_AGE = 30 * 24 * 3600

export const adminEnabled = password.length > 0

const sign = (payload: string) => createHmac('sha256', secret).update(payload).digest('base64url')

const safeEqual = (a: string, b: string) => {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

export async function isAdmin(): Promise<boolean> {
  if (!adminEnabled) return false
  const value = (await cookies()).get(COOKIE)?.value
  if (!value) return false
  const [exp, sig] = value.split('.')
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false
  return safeEqual(sig, sign(`admin.${exp}`))
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}

export async function startSession(attempt: string): Promise<boolean> {
  // Pequena espera fixa: deixa tentativa por força bruta bem mais lenta.
  await new Promise((r) => setTimeout(r, 400))
  if (!adminEnabled || !safeEqual(sign(attempt), sign(password))) return false
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE
  ;(await cookies()).set(COOKIE, `${exp}.${sign(`admin.${exp}`)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && !devStoreOn,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
  return true
}

export async function endSession() {
  ;(await cookies()).delete(COOKIE)
}
