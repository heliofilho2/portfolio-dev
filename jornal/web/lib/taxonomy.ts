// Espelha collector/Models.cs (Taxonomy): mudou lá, muda aqui.
export const categories = ['IA', 'Big Tech', 'Dev Tools', 'Linguagens', 'Pesquisa'] as const

export const topics = [
  'Claude', 'OpenAI', 'Google', 'Meta', 'Apple', 'Microsoft', 'Samsung', 'Nvidia', 'Amazon',
  'IA generativa', 'Agentes', 'Open Source', 'Segurança', 'Regulação', 'Hardware',
  'Carros Elétricos', 'Realidade aumentada', 'Brasil',
] as const

export type Priority = 'alta' | 'media' | 'baixa'

export const categoryStyle: Record<string, { initials: string; className: string }> = {
  IA: { initials: 'IA', className: 'bg-[#E3ECEA] text-[#1F5F5B]' },
  'Big Tech': { initials: 'BT', className: 'bg-[#EFE7D8] text-[#7A5B23]' },
  'Dev Tools': { initials: 'DT', className: 'bg-[#F1E2DA] text-[#8C4A30]' },
  Linguagens: { initials: 'LG', className: 'bg-[#E6EAE0] text-[#4F6B3C]' },
  Pesquisa: { initials: 'PQ', className: 'bg-[#E7E5ED] text-[#4A4770]' },
  Outro: { initials: '··', className: 'bg-paper-2 text-muted' },
}
