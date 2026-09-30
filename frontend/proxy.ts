import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Desligado por padrão. Para ligar, definir MAINTENANCE_MODE=true na Vercel e fazer redeploy.
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true'

export function proxy(request: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next()

  const { pathname } = request.nextUrl

  // Painel e APIs continuam acessíveis: dá pra preparar conteúdo com o site fechado.
  if (pathname.startsWith('/maintenance') || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/maintenance'
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Aplica em todas as rotas, exceto assets estáticos, favicon e imagens públicas.
    '/((?!_next/static|_next/image|favicon.ico|icon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
