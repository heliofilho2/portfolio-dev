import type { RawRow } from './data'

// Dados de exemplo do próprio protótipo (docs/design/jornal), usados só em
// `npm run dev` sem Supabase configurado. Horários espalhados em 0–40h pra
// a Cotação das fontes ter o que comparar entre hoje e ontem.
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()

export const sampleRows: RawRow[] = [
  { title_pt: 'Modelo aberto supera os fechados em programação', summary_pt: 'Pesos liberados sob licença permissiva e desempenho próximo dos líderes em tarefas de código. Quem roda modelo local ganha uma opção séria.', source: 'The Verge', published_at: hoursAgo(0.7), category: 'IA', priority: 'alta', trending: true },
  { title_pt: 'Modelo aberto de código chama atenção da comunidade', summary_pt: 'Cobertura destaca a licença permissiva e os benchmarks de programação divulgados pelo fabricante.', source: 'Ars Technica', published_at: hoursAgo(1.1), category: 'IA', priority: 'alta', trending: true },
  { title_pt: 'Regulação europeia de IA começa a ser fiscalizada', summary_pt: 'Empresas precisam documentar dados de treino de modelos de uso geral. Multas passam a valer no próximo trimestre.', source: 'MIT Technology Review', published_at: hoursAgo(1.8), category: 'Big Tech', priority: 'alta', trending: false },
  { title_pt: 'Runtime JavaScript roda TypeScript sem build', summary_pt: 'Arquivos .ts executam direto em desenvolvimento. Benchmarks mostram inicialização mais rápida.', source: 'GitHub Blog', published_at: hoursAgo(0.3), category: 'Dev Tools', priority: 'media', trending: false },
  { title_pt: 'Assistente de código ganha modo agente no terminal', summary_pt: 'Executa testes, lê logs e propõe correções em sequência, sem sair da linha de comando.', source: 'Simon Willison', published_at: hoursAgo(2.5), category: 'Dev Tools', priority: 'media', trending: false },
  { title_pt: 'Startup brasileira de agentes capta série A', summary_pt: 'Foco em automação de atendimento para o varejo; parte do time veio de bancos digitais.', source: 'Tecnoblog', published_at: hoursAgo(3.2), category: 'Big Tech', priority: 'media', trending: false },
  { title_pt: 'Método reduz alucinação em sistemas RAG', summary_pt: 'Verificação cruzada entre trechos recuperados antes de gerar a resposta. Código aberto.', source: 'arXiv cs.AI', published_at: hoursAgo(4.5), category: 'Pesquisa', priority: 'media', trending: false },
  { title_pt: 'Framework publica guia de migração para React 19', summary_pt: 'Server components e novos hooks documentados com exemplos.', source: 'GitHub Blog', published_at: hoursAgo(6), category: 'Dev Tools', priority: 'baixa', trending: false },
  { title_pt: 'Opinião: o fim do "prompt engineer" como cargo', summary_pt: 'Ensaio argumenta que a habilidade virou parte do trabalho de qualquer dev.', source: 'MIT Technology Review', published_at: hoursAgo(8), category: 'Big Tech', priority: 'baixa', trending: false },
  { title_pt: 'Nova versão do compilador traz ganhos modestos', summary_pt: 'Changelog lista otimizações incrementais no coletor de lixo e no tempo de compilação a frio.', source: 'Simon Willison', published_at: hoursAgo(30), category: 'Linguagens', priority: 'baixa', trending: false },
  { title_pt: 'Ferramenta de observabilidade passa de 10 mil estrelas', summary_pt: 'Projeto promete substituir parte do stack de monitoramento tradicional com footprint menor.', source: 'The Verge', published_at: hoursAgo(32), category: 'Dev Tools', priority: 'media', trending: false },
  { title_pt: 'Samsung amplia parceria em baterias para carros elétricos', summary_pt: 'Acordo mira produção de células com maior densidade energética a partir de 2027.', source: 'Ars Technica', published_at: hoursAgo(34), category: 'Big Tech', priority: 'baixa', trending: false },
]
