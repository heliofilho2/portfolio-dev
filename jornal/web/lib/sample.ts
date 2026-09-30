import type { RawRow } from './data'

// Dados de exemplo do próprio protótipo (docs/design/jornal), usados só em
// `npm run dev` sem Supabase configurado. Horários espalhados em 0–40h pra
// a Cotação das fontes ter o que comparar entre hoje e ontem. O link de cada
// item vai pra home da fonte (não existe artigo de verdade por trás do exemplo).
// As duas primeiras notícias (prioridade alta) têm body_pt de exemplo, pra mostrar
// como fica a página de matéria completa (app/materia/[id]).
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()

const bodyModeloAberto = `Segundo o The Verge, o laboratório liberou os pesos do modelo sob uma licença permissiva, o que permite uso comercial e redistribuição sem custo de licenciamento. Em testes de programação publicados junto do lançamento, o desempenho ficou próximo do topo dos modelos fechados da mesma faixa de tamanho.

A publicação destaca que quem já roda modelos localmente ganha, pela primeira vez nessa categoria, uma opção que não fica muito atrás dos serviços pagos em tarefas de código. O texto original não detalha o custo de treinamento nem o tamanho exato do conjunto de dados usado.

O anúncio já foi replicado por outros veículos de tecnologia nas horas seguintes, o que levou a notícia a aparecer como destaque em mais de uma fonte monitorada por este jornal.`

const bodyRegulacao = `De acordo com a MIT Technology Review, a regra que exige documentação sobre a origem dos dados de treino de modelos de uso geral passa a ser fiscalizada a partir do próximo trimestre. Empresas que não cumprirem o prazo ficam sujeitas a multa.

A reportagem cita que o texto da regulação já estava aprovado há mais de um ano, mas a fase de fiscalização ativa só começa agora. Não há, no material original, uma lista pública de quais empresas já enviaram a documentação exigida.`

export const sampleRows: RawRow[] = [
  { id: 1, title_pt: 'Modelo aberto supera os fechados em programação', summary_pt: 'Pesos liberados sob licença permissiva e desempenho próximo dos líderes em tarefas de código. Quem roda modelo local ganha uma opção séria.', body_pt: bodyModeloAberto, source: 'The Verge', url: 'https://www.theverge.com', published_at: hoursAgo(0.7), category: 'IA', priority: 'alta', trending: true },
  { id: 2, title_pt: 'Modelo aberto de código chama atenção da comunidade', summary_pt: 'Cobertura destaca a licença permissiva e os benchmarks de programação divulgados pelo fabricante.', body_pt: null, source: 'Ars Technica', url: 'https://arstechnica.com', published_at: hoursAgo(1.1), category: 'IA', priority: 'alta', trending: true },
  { id: 3, title_pt: 'Regulação europeia de IA começa a ser fiscalizada', summary_pt: 'Empresas precisam documentar dados de treino de modelos de uso geral. Multas passam a valer no próximo trimestre.', body_pt: bodyRegulacao, source: 'MIT Technology Review', url: 'https://www.technologyreview.com', published_at: hoursAgo(1.8), category: 'Big Tech', priority: 'alta', trending: false },
  { id: 4, title_pt: 'Runtime JavaScript roda TypeScript sem build', summary_pt: 'Arquivos .ts executam direto em desenvolvimento. Benchmarks mostram inicialização mais rápida.', body_pt: null, source: 'GitHub Blog', url: 'https://github.blog', published_at: hoursAgo(0.3), category: 'Dev Tools', priority: 'media', trending: false },
  { id: 5, title_pt: 'Assistente de código ganha modo agente no terminal', summary_pt: 'Executa testes, lê logs e propõe correções em sequência, sem sair da linha de comando.', body_pt: null, source: 'Simon Willison', url: 'https://simonwillison.net', published_at: hoursAgo(2.5), category: 'Dev Tools', priority: 'media', trending: false },
  { id: 6, title_pt: 'Startup brasileira de agentes capta série A', summary_pt: 'Foco em automação de atendimento para o varejo; parte do time veio de bancos digitais.', body_pt: null, source: 'Tecnoblog', url: 'https://tecnoblog.net', published_at: hoursAgo(3.2), category: 'Big Tech', priority: 'media', trending: false },
  { id: 7, title_pt: 'Método reduz alucinação em sistemas RAG', summary_pt: 'Verificação cruzada entre trechos recuperados antes de gerar a resposta. Código aberto.', body_pt: null, source: 'arXiv cs.AI', url: 'https://arxiv.org/list/cs.AI/recent', published_at: hoursAgo(4.5), category: 'Pesquisa', priority: 'media', trending: false },
  { id: 8, title_pt: 'Framework publica guia de migração para React 19', summary_pt: 'Server components e novos hooks documentados com exemplos.', body_pt: null, source: 'GitHub Blog', url: 'https://github.blog', published_at: hoursAgo(6), category: 'Dev Tools', priority: 'baixa', trending: false },
  { id: 9, title_pt: 'Opinião: o fim do "prompt engineer" como cargo', summary_pt: 'Ensaio argumenta que a habilidade virou parte do trabalho de qualquer dev.', body_pt: null, source: 'MIT Technology Review', url: 'https://www.technologyreview.com', published_at: hoursAgo(8), category: 'Big Tech', priority: 'baixa', trending: false },
  { id: 10, title_pt: 'Nova versão do compilador traz ganhos modestos', summary_pt: 'Changelog lista otimizações incrementais no coletor de lixo e no tempo de compilação a frio.', body_pt: null, source: 'Simon Willison', url: 'https://simonwillison.net', published_at: hoursAgo(30), category: 'Linguagens', priority: 'baixa', trending: false },
  { id: 11, title_pt: 'Ferramenta de observabilidade passa de 10 mil estrelas', summary_pt: 'Projeto promete substituir parte do stack de monitoramento tradicional com footprint menor.', body_pt: null, source: 'The Verge', url: 'https://www.theverge.com', published_at: hoursAgo(32), category: 'Dev Tools', priority: 'media', trending: false },
  { id: 12, title_pt: 'Samsung amplia parceria em baterias para carros elétricos', summary_pt: 'Acordo mira produção de células com maior densidade energética a partir de 2027.', body_pt: null, source: 'Ars Technica', url: 'https://arstechnica.com', published_at: hoursAgo(34), category: 'Big Tech', priority: 'baixa', trending: false },
]
