'use client'

import { useEffect } from 'react'

// Reveal-on-scroll do protótipo (docs/design/jornal): IntersectionObserver com stagger de 70ms.
// O stagger vale só dentro de cada lote que entra na tela junto; antes, o contador
// era global e cada bloco novo esperava mais que o anterior (o 20º esperava 1,6s).
// prefers-reduced-motion é tratado no CSS.
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.setAttribute('data-in', ''))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        let i = 0
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const delay = Math.min(i++, 4) * 70
          el.style.setProperty('--rv-delay', `${delay}ms`)
          el.setAttribute('data-in', '')
          io.unobserve(el)
          // Tira o atraso depois da entrada, pra não atrasar transições de hover.
          setTimeout(() => el.style.removeProperty('--rv-delay'), delay + 650)
        }
      },
      // threshold em fração do próprio elemento quebra pra blocos mais altos que a tela (ex.: a lista
      // de notícias do dia nunca cobre 8% de si mesma na viewport) - 0 dispara no primeiro pixel
      // visível, o que funciona pra qualquer altura. Mesmo bug corrigido em frontend/lib/useReveal.ts.
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    )

    els.forEach((el) => {
      io.observe(el)
    })

    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
