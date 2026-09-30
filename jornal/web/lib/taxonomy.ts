// Espelha collector/Models.cs (Taxonomy.Categories): mudou lá, muda aqui.
export const categories = ['IA', 'Big Tech', 'Dev Tools', 'Linguagens', 'Pesquisa'] as const

// Espelha collector/Models.cs (NewsSources.All), usado na "Cotação das fontes".
export const sources = [
  'OpenAI Blog', 'Google DeepMind Blog', 'The Verge', 'Ars Technica',
  'MIT Technology Review', 'Simon Willison', 'GitHub Blog', 'Tecnoblog', 'arXiv cs.AI',
] as const

export type Priority = 'alta' | 'media' | 'baixa'
