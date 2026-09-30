'use client'

import { useReveal } from '@/lib/useReveal'

// Ativa o reveal-on-scroll de [data-reveal] na página. Sem filhos: o observer
// olha o document inteiro, então isso pode ficar em qualquer ponto da árvore.
export default function PageReveal() {
  useReveal()
  return null
}
