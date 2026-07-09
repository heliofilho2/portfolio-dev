import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Ativo por padrão. Para desligar, definir MAINTENANCE_MODE=false na Vercel.
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE !== 'false'

export function proxy(request: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next()

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/maintenance')) {
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
