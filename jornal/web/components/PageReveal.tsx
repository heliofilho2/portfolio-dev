'use client'

import { useReveal } from '@/lib/useReveal'

export default function PageReveal({ deps = [] }: { deps?: unknown[] }) {
  useReveal(deps)
  return null
}
