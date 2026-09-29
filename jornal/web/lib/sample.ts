import type { NewsItem } from './news'

// Dados ilustrativos do protótipo, usados só em `npm run dev` sem Supabase configurado
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()

export function sampleNews(): NewsItem[] {
  return [
    { id: 1, url: 'https://example.com/1', title_pt: 'Novo modelo da linha Claude chega com foco em raciocínio passo a passo', summary_pt: 'Atualização amplia janela de contexto e melhora desempenho em tarefas de código, segundo benchmarks internos divulgados pela Anthropic.', source: 'Simon Willison', published_at: hoursAgo(2), category: 'IA', topics: ['Claude', 'IA generativa'], priority: 'alta', trending: true },
    { id: 2, url: 'https://example.com/2', title_pt: 'Meta detalha nova geração de óculos com IA embarcada', summary_pt: 'Empresa aposta em processamento local para reduzir latência de comandos de voz e reconhecimento de imagem.', source: 'The Verge', published_at: hoursAgo(5), category: 'Big Tech', topics: ['Meta', 'Realidade aumentada'], priority: 'media', trending: false },
    { id: 3, url: 'https://example.com/3', title_pt: 'Ferramenta open source de observabilidade passa de 10 mil estrelas no GitHub em uma semana', summary_pt: 'Projeto promete substituir parte do stack de monitoramento tradicional com footprint menor de recursos.', source: 'GitHub Blog', published_at: hoursAgo(8), category: 'Dev Tools', topics: ['Open Source'], priority: 'media', trending: true },
    { id: 4, url: 'https://example.com/4', title_pt: 'Nova versão do compilador traz ganhos modestos de performance', summary_pt: 'Changelog lista otimizações incrementais no coletor de lixo e no tempo de compilação a frio.', source: 'Simon Willison', published_at: hoursAgo(12), category: 'Linguagens', topics: [], priority: 'baixa', trending: false },
    { id: 5, url: 'https://example.com/5', title_pt: 'Apple deve apresentar novidades de IA on-device no próximo evento', summary_pt: 'Rumores apontam para integração mais profunda de modelos locais no sistema, sem depender de nuvem.', source: 'MIT Technology Review', published_at: hoursAgo(26), category: 'Big Tech', topics: ['Apple'], priority: 'media', trending: false },
    { id: 6, url: 'https://example.com/6', title_pt: 'Samsung amplia parceria com fabricantes de baterias para carros elétricos', summary_pt: 'Acordo mira produção de células com maior densidade energética a partir de 2027.', source: 'Ars Technica', published_at: hoursAgo(28), category: 'Big Tech', topics: ['Samsung', 'Carros Elétricos'], priority: 'baixa', trending: false },
    { id: 7, url: 'https://example.com/7', title_pt: 'Paper propõe técnica para reduzir alucinação em modelos de raciocínio longo', summary_pt: 'Resultados preliminares mostram queda mensurável em respostas incorretas sem custo adicional relevante de inferência.', source: 'arXiv cs.AI', published_at: hoursAgo(30), category: 'Pesquisa', topics: ['IA generativa'], priority: 'alta', trending: true },
    { id: 8, url: 'https://example.com/8', title_pt: 'OpenAI publica guia de boas práticas para uso de agentes em produção', summary_pt: 'Documento cobre limites de contexto, tratamento de erros e estratégias de fallback.', source: 'OpenAI Blog', published_at: hoursAgo(40), category: 'Dev Tools', topics: ['OpenAI', 'Agentes'], priority: 'media', trending: false },
  ]
}
