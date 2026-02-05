import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes CSS de forma inteligente
 * 
 * POR QUÊ esta função?
 * - clsx: combina classes condicionalmente
 * - tailwind-merge: resolve conflitos do Tailwind
 * 
 * Exemplo:
 * cn("p-4", condition && "bg-blue-500", "p-6")
 * → "bg-blue-500 p-6" (p-4 é sobrescrito por p-6)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
