import type { CofreItem, Project, ProjectUpdate, Tone } from './contentModel'

// Conteúdo inicial, migrado do Cofre no Notion (set/2026). Serve pra duas coisas:
// 1. dado local no `npm run dev` sem Supabase;
// 2. gerar a carga inicial do banco: `node scripts/content-sql.mjs > supabase/content.sql`.
// Depois da carga, a fonte da verdade passa a ser o Supabase.

interface RepoInput {
  slug: string
  title: string
  topic: string
  tone: Tone
  summary: string
  what: string
  why: string[]
  start: string[]
  who: string
  github: string
  date: string
}

const repo = (r: RepoInput): CofreItem => ({
  slug: r.slug,
  category: 'Repos',
  topic: r.topic,
  title: r.title,
  summary: r.summary,
  body_md: [
    '## O que é',
    r.what,
    '## Por que vale a pena',
    r.why.map((w) => `- ${w}`).join('\n'),
    '## Como começar',
    r.start.map((s, i) => `${i + 1}. ${s}`).join('\n'),
    '## Pra quem é',
    r.who,
    `→ [Abrir no GitHub](${r.github})`,
  ].join('\n\n'),
  tone: r.tone,
  video_url: null,
  keyword: null,
  materials: [],
  chapters: [],
  published_at: r.date,
})

export const seedCofre: CofreItem[] = [
  {
    slug: 'repositorios-secretos',
    category: 'Vídeos',
    topic: null,
    title: 'Central de Repositórios Secretos',
    summary: 'Alguns dos projetos mais curiosos que encontrei no GitHub.',
    body_md: `Tecnologia, IA, internet e as coisas mais estranhas que encontro pelo caminho.

> **Atenção:** verifique sempre a licença, segurança e finalidade de cada projeto antes de instalar qualquer software.

## Streaming e TV

### SmartTube
**GitHub:** [yuliskov/SmartTube](https://github.com/yuliskov/SmartTube)

Cliente gratuito e open source para **Android TV e TV boxes**, com recursos como SponsorBlock, reprodução em 8K/60fps, HDR e interface otimizada para televisão. O projeto informa que não é oficialmente distribuído por lojas de aplicativos e recomenda utilizar seus canais oficiais de instalação.

**Compatibilidade:** Android TV e TV boxes.
**Não funciona:** iPhone, Apple TV, Samsung Tizen e LG webOS.

> ⚠️ Baixe somente pelos canais indicados no próprio projeto. O mantenedor alerta sobre cópias distribuídas por sites de APK e terceiros.

### Sonarr
**GitHub:** [stevietv/Sonarr](https://github.com/stevietv/Sonarr)

Ferramenta de gerenciamento automatizado de séries e conteúdo de mídia. O repositório apresentado é voltado a automação de uma biblioteca de mídia.

> ⚠️ O projeto pode envolver automação de downloads. Use somente com conteúdo que você tenha direito de obter.

## Adobe e design

### GenP
**GitHub:** [TheMythologist/GenP](https://github.com/TheMythologist/GenP)

Projeto open source que automatiza a compilação do **GenP**, um patcher relacionado ao licenciamento dos aplicativos Adobe Creative Cloud. O próprio repositório diz que seu uso pode violar os termos da Adobe e leis aplicáveis.

**Importante:** não recomendo instalar ou utilizar ferramentas para contornar licenças. Se o objetivo for estudar o projeto, o código-fonte e a estrutura do repositório estão disponíveis publicamente.

## Projetos curiosos

### grqz/grqz
**GitHub:** [grqz/grqz](https://github.com/grqz/grqz)

Repositório pessoal do desenvolvedor **GRQZ**, apresentado como um espaço para experimentar diferentes projetos e ideias.

### WitherOrNot/llvm-project
**GitHub:** [WitherOrNot/llvm-project](https://github.com/WitherOrNot/llvm-project)

Fork/modificação do projeto LLVM, uma coleção de tecnologias de compiladores e ferramentas de desenvolvimento.

## Antes de instalar qualquer projeto

- Prefira sempre o **repositório original**.
- Leia o README e as instruções oficiais.
- Verifique a licença.
- Não execute arquivos \`.exe\`, scripts ou APKs de fontes desconhecidas.
- Não use ferramentas para contornar licenças ou acessar conteúdo sem autorização.
- Projetos no GitHub podem mudar de mantenedor ou ser comprometidos; verifique a atividade e os avisos recentes antes de executar qualquer coisa.`,
    tone: 'rose',
    video_url: null,
    keyword: 'REPOS',
    materials: [
      { label: 'SmartTube', sub: 'GitHub · Android TV', url: 'https://github.com/yuliskov/SmartTube' },
      { label: 'Sonarr', sub: 'GitHub · mídia', url: 'https://github.com/stevietv/Sonarr' },
      { label: 'GenP', sub: 'GitHub · só para estudo', url: 'https://github.com/TheMythologist/GenP' },
      { label: 'grqz/grqz', sub: 'GitHub', url: 'https://github.com/grqz/grqz' },
      { label: 'WitherOrNot/llvm-project', sub: 'GitHub · compiladores', url: 'https://github.com/WitherOrNot/llvm-project' },
    ],
    chapters: [],
    published_at: '2026-09-26T12:00:00Z',
  },

  repo({
    slug: 'ollama',
    title: 'Ollama',
    topic: 'IA no seu computador',
    tone: 'lilac',
    summary: 'Roda modelos de IA abertos no seu computador, com um comando só.',
    what: 'O Ollama é uma ferramenta que baixa e executa modelos de linguagem abertos, como Llama, Gemma, Mistral e Qwen, direto na sua máquina. Ele cuida da parte chata (download, configuração, uso da placa de vídeo) e você só conversa.',
    why: [
      '**Privacidade:** nada sai do seu computador. Dá para usar com documentos sensíveis.',
      '**Custo zero por uso:** sem assinatura e sem limite de mensagens.',
      '**Funciona offline:** depois de baixar o modelo, não precisa de internet.',
      '**Para devs:** expõe uma API local, então dá para integrar IA nos seus projetos sem pagar API.',
    ],
    start: [
      'Baixe o instalador no site oficial do Ollama (Windows, Mac ou Linux).',
      'Abra o terminal e rode `ollama run <nome do modelo>`. A lista de modelos fica na biblioteca do próprio Ollama.',
      'Converse direto no terminal. Para uma interface bonita, use o Open WebUI junto.',
    ],
    who: 'Qualquer pessoa curiosa com IA. Modelos pequenos rodam bem até em notebook comum; os maiores pedem mais memória e uma boa placa de vídeo.',
    github: 'https://github.com/ollama/ollama',
    date: '2026-09-20T12:00:00Z',
  }),
  repo({
    slug: 'open-webui',
    title: 'Open WebUI',
    topic: 'IA no seu computador',
    tone: 'lilac',
    summary: 'Uma interface parecida com o ChatGPT para os modelos que rodam no seu computador.',
    what: 'O Open WebUI é uma interface web open source para conversar com modelos de IA locais (via Ollama) ou por API. Ele transforma o terminal numa experiência de chat completa.',
    why: [
      'Histórico de conversas, vários modelos e troca rápida entre eles.',
      'Upload de documentos para conversar com seus próprios arquivos.',
      'Contas de usuário: dá para compartilhar com a família ou a equipe.',
    ],
    start: [
      'Tenha o Ollama instalado e funcionando.',
      'Suba o Open WebUI via Docker, usando o comando do README do projeto.',
      'Abra no navegador, crie sua conta e escolha o modelo.',
    ],
    who: 'Quem já testou o Ollama e quer uma experiência de uso diário. Precisa de Docker instalado.',
    github: 'https://github.com/open-webui/open-webui',
    date: '2026-09-20T11:00:00Z',
  }),
  repo({
    slug: 'jellyfin',
    title: 'Jellyfin',
    topic: 'Mídia e streaming',
    tone: 'peach',
    summary: 'Seu próprio servidor de streaming, com os seus filmes, séries e músicas.',
    what: 'O Jellyfin é um servidor de mídia open source. Você aponta para as pastas com seus arquivos e ele organiza tudo com capas, sinopses e "continuar assistindo", como um serviço de streaming, só que seu.',
    why: [
      '**100% gratuito:** sem assinatura e sem recursos travados atrás de plano pago.',
      '**Assiste em qualquer lugar:** navegador, celular, smart TV e videogame.',
      '**Seus arquivos, suas regras:** sem anúncio e sem coleta de dados.',
    ],
    start: [
      'Instale o Jellyfin num computador que fica ligado (ou via Docker).',
      'Abra no navegador e adicione as pastas da sua biblioteca.',
      'Instale o app do Jellyfin na TV ou no celular e conecte ao seu servidor.',
    ],
    who: 'Quem tem uma coleção própria de filmes, séries, músicas ou vídeos de família e quer assistir de qualquer aparelho da casa.',
    github: 'https://github.com/jellyfin/jellyfin',
    date: '2026-09-19T12:00:00Z',
  }),
  repo({
    slug: 'yt-dlp',
    title: 'yt-dlp',
    topic: 'Mídia e streaming',
    tone: 'peach',
    summary: 'Baixa vídeo e áudio de milhares de sites, com controle total de qualidade e formato.',
    what: 'O yt-dlp é um programa de linha de comando open source para baixar vídeos e áudios. É o sucessor mais ativo do antigo youtube-dl e suporta milhares de sites.',
    why: [
      'Sem anúncio, sem site duvidoso e sem limite de download.',
      'Escolhe resolução, extrai só o áudio, baixa playlists inteiras e legendas.',
      'Atualizado com frequência pela comunidade.',
    ],
    start: [
      'Instale pelo gerenciador de pacotes do seu sistema (winget, brew ou pip).',
      'No terminal, rode `yt-dlp <link do vídeo>`.',
      'Para baixar só o áudio: `yt-dlp -x <link>`.',
    ],
    who: 'Quem não tem medo de terminal. Use com responsabilidade: baixe apenas conteúdo que você tem direito de guardar.',
    github: 'https://github.com/yt-dlp/yt-dlp',
    date: '2026-09-19T11:00:00Z',
  }),
  repo({
    slug: 'immich',
    title: 'Immich',
    topic: 'Troque serviços pagos',
    tone: 'mint',
    summary: 'Uma alternativa ao Google Fotos que roda no seu próprio servidor.',
    what: 'O Immich é um sistema open source de fotos e vídeos com app para celular, backup automático, reconhecimento facial, mapa de lugares e busca inteligente ("praia", "cachorro", "aniversário").',
    why: [
      'Para de pagar armazenamento na nuvem todo mês.',
      'Suas fotos ficam sob seu controle, e não no servidor de uma empresa.',
      'A experiência é muito parecida com a do Google Fotos.',
    ],
    start: [
      'Separe um computador ou servidor que fique sempre ligado, com espaço em disco.',
      'Instale via Docker Compose seguindo o guia oficial.',
      'Instale o app Immich no celular, aponte para o seu servidor e ative o backup.',
    ],
    who: 'Quem tem milhares de fotos e quer sair da mensalidade. Exige um pouco de configuração e um disco confiável (faça backup do backup).',
    github: 'https://github.com/immich-app/immich',
    date: '2026-09-18T12:00:00Z',
  }),
  repo({
    slug: 'n8n',
    title: 'n8n',
    topic: 'Troque serviços pagos',
    tone: 'mint',
    summary: 'Automação visual estilo Zapier que você pode hospedar sozinho, com IA integrada.',
    what: 'O n8n é uma plataforma de automação: você conecta apps, APIs e modelos de IA arrastando blocos, e ainda pode escrever código quando precisar.',
    why: [
      'Hospedando você mesmo, não paga por execução.',
      'Centenas de integrações prontas (planilhas, e-mail, Telegram, Notion, IA).',
      'Automatiza desde relatórios até resumos diários feitos com IA.',
    ],
    start: [
      'Para testar rápido, rode `npx n8n` ou suba via Docker.',
      'Abra no navegador e crie seu primeiro fluxo a partir de um template.',
      'Quando gostar, hospede num servidor para rodar 24 horas.',
    ],
    who: 'Quem repete tarefas no computador toda semana. Existe também uma versão em nuvem, paga, para quem não quer manter servidor.',
    github: 'https://github.com/n8n-io/n8n',
    date: '2026-09-18T11:00:00Z',
  }),
  repo({
    slug: 'localsend',
    title: 'LocalSend',
    topic: 'Ferramentas do dia a dia',
    tone: 'sky',
    summary: 'Um AirDrop que funciona entre qualquer sistema: Windows, Mac, Linux, Android e iPhone.',
    what: 'O LocalSend é um app open source para enviar arquivos entre aparelhos na mesma rede Wi-Fi, sem internet, sem cadastro e sem nuvem no meio.',
    why: [
      'Acabou o "manda no WhatsApp pra mim mesmo".',
      'Arquivos grandes vão direto de um aparelho para o outro, sem perder qualidade.',
      'Tudo criptografado e sem conta.',
    ],
    start: [
      'Instale o LocalSend nos dois aparelhos (tem nas lojas oficiais de todos os sistemas).',
      'Conecte os dois na mesma rede Wi-Fi.',
      'Escolha o arquivo, toque no aparelho de destino e aceite do outro lado.',
    ],
    who: 'Todo mundo. É o tipo de app que você instala uma vez e usa para sempre.',
    github: 'https://github.com/localsend/localsend',
    date: '2026-09-17T12:00:00Z',
  }),
  repo({
    slug: 'stirling-pdf',
    title: 'Stirling-PDF',
    topic: 'Ferramentas do dia a dia',
    tone: 'sky',
    summary: 'Junta, divide, comprime, converte e edita PDF sem subir seus arquivos para site nenhum.',
    what: 'O Stirling-PDF é uma ferramenta open source com dezenas de funções para PDF, que roda na sua máquina ou no seu servidor, acessada pelo navegador.',
    why: [
      'Substitui aqueles sites de PDF cheios de anúncio.',
      'Seus documentos não saem do seu computador: ideal para contrato, extrato e documento pessoal.',
      'Faz coisas que muita ferramenta paga cobra, como OCR, assinatura e compressão.',
    ],
    start: ['Instale via Docker ou pelo instalador desktop disponível no repositório.', 'Abra no navegador.', 'Escolha a ferramenta, arraste o PDF e baixe o resultado.'],
    who: 'Quem mexe com PDF toda semana e se preocupa com privacidade.',
    github: 'https://github.com/Stirling-Tools/Stirling-PDF',
    date: '2026-09-17T11:00:00Z',
  }),
  repo({
    slug: 'public-apis',
    title: 'Public APIs',
    topic: 'Listas que valem ouro',
    tone: 'butter',
    summary: 'Centenas de APIs gratuitas organizadas por tema, prontas para virar projeto.',
    what: 'Um dos repositórios mais famosos do GitHub: uma lista de APIs públicas separadas por categoria, como clima, finanças, filmes, games, música, esportes e muito mais.',
    why: [
      'É o melhor remédio para o "não sei que projeto fazer".',
      'Cada API indica se precisa de chave, se aceita HTTPS e se funciona no navegador.',
      'Ótimo para montar portfólio com projetos que usam dados reais.',
    ],
    start: [
      'Abra o repositório e escolha uma categoria que te interessa.',
      'Entre na documentação de uma API e faça sua primeira requisição.',
      'Transforme em algo pequeno: um bot, um painel ou um app.',
    ],
    who: 'Quem está aprendendo a programar ou quer ideias de projeto.',
    github: 'https://github.com/public-apis/public-apis',
    date: '2026-09-16T12:00:00Z',
  }),
  repo({
    slug: 'free-for-dev',
    title: 'free-for.dev',
    topic: 'Listas que valem ouro',
    tone: 'butter',
    summary: 'Todos os serviços com plano gratuito para quem desenvolve.',
    what: 'Uma lista mantida pela comunidade com serviços de hospedagem, banco de dados, autenticação, e-mail, monitoramento e muito mais que têm plano gratuito útil para desenvolvedores.',
    why: [
      'Dá para colocar um projeto inteiro no ar gastando zero.',
      'Economiza horas de pesquisa comparando serviços.',
      'Perfeito para validar uma ideia de SaaS antes de gastar dinheiro.',
    ],
    start: [
      'Use o Ctrl+F para ir direto à categoria que você precisa.',
      'Compare os limites de cada plano gratuito.',
      'Sempre confira a página oficial do serviço, porque planos gratuitos mudam.',
    ],
    who: 'Devs com projeto pessoal, estudantes e quem está começando um SaaS.',
    github: 'https://github.com/ripienaar/free-for-dev',
    date: '2026-09-16T11:00:00Z',
  }),
  repo({
    slug: 'book-of-secret-knowledge',
    title: 'The Book of Secret Knowledge',
    topic: 'Listas que valem ouro',
    tone: 'butter',
    summary: 'Um baú de ferramentas, comandos e truques de terminal, redes e segurança.',
    what: 'Uma coleção enorme de listas, manuais, cheatsheets, one-liners e ferramentas usadas por administradores de sistema, devs e profissionais de segurança.',
    why: ['Comandos de terminal que economizam horas.', 'Ferramentas de rede e segurança que pouca gente conhece.', 'É o tipo de repositório que você salva e consulta por anos.'],
    start: ['Não tente ler tudo: é grande demais.', 'Use o Ctrl+F com o assunto do momento: SSH, DNS, Docker, terminal.', 'Teste um comando novo por semana.'],
    who: 'Devs, pessoas de infraestrutura e curiosos de segurança.',
    github: 'https://github.com/trimstray/the-book-of-secret-knowledge',
    date: '2026-09-16T10:00:00Z',
  }),
  repo({
    slug: 'build-your-own-x',
    title: 'Build Your Own X',
    topic: 'Aprender construindo',
    tone: 'rose',
    summary: 'Tutoriais para recriar do zero as tecnologias que você usa todo dia.',
    what: 'Uma coleção de guias passo a passo para construir sua própria versão de Git, banco de dados, servidor web, navegador, blockchain e até sistema operacional, em várias linguagens.',
    why: [
      'A melhor forma de entender algo é construir.',
      'Você sai de usuário para quem sabe o que acontece por baixo.',
      'Projetos assim chamam muita atenção no portfólio.',
    ],
    start: [
      'Escolha uma tecnologia que te dá curiosidade.',
      'Filtre por uma linguagem que você já conhece.',
      'Comece pelos menores, como um servidor web ou um interpretador simples.',
    ],
    who: 'Quem já programa o básico e quer subir de nível.',
    github: 'https://github.com/codecrafters-io/build-your-own-x',
    date: '2026-09-15T12:00:00Z',
  }),
  repo({
    slug: 'developer-roadmap',
    title: 'Developer Roadmap',
    topic: 'Aprender construindo',
    tone: 'rose',
    summary: 'Mapas visuais do que estudar em cada carreira de tecnologia.',
    what: 'O projeto por trás do [roadmap.sh](https://roadmap.sh): trilhas interativas para frontend, backend, DevOps, IA, dados e dezenas de outras áreas e linguagens.',
    why: ['Resolve a pergunta "o que eu estudo agora?".', 'Você enxerga o caminho inteiro e marca o que já aprendeu.', 'Cada tópico traz links de estudo gratuitos.'],
    start: ['Acesse o site [roadmap.sh](https://roadmap.sh).', 'Escolha a trilha da carreira que você quer.', 'Siga os tópicos em ordem e marque seu progresso.'],
    who: 'Quem está entrando na área, mudando de carreira ou quer tapar buracos no conhecimento.',
    github: 'https://github.com/kamranahmedse/developer-roadmap',
    date: '2026-09-15T11:00:00Z',
  }),

  {
    slug: 'produtos-que-eu-uso',
    category: 'Produtos',
    topic: null,
    title: 'Produtos que eu uso',
    summary: 'O equipamento que eu uso para gravar meus vídeos. Se não uso, não entra aqui.',
    body_md: `*Como associado da Amazon, recebo por compras qualificadas, sem custo extra para você.*

## Áudio

### Shure SM7B
Microfone dinâmico de estúdio, o clássico de podcast. Por ser dinâmico, capta a voz e rejeita boa parte do ruído do ambiente, ótimo para quarto sem tratamento acústico.

→ [Ver na Amazon](https://link.amazon/B05DKW5Az)

### Hollyland Lark M2
Microfone de lapela sem fio, pequeno e discreto, com cancelamento de ruído e bateria para o dia todo. Liga direto no celular, perfeito para gravar em qualquer lugar.

→ [Ver na Amazon](https://link.amazon/B03btxoZr)

## Vídeo

### DJI Osmo Pocket 3
Câmera de bolso com estabilizador embutido, sensor de 1 polegada e gravação em 4K. Tela giratória para se enquadrar sozinho. Cabe no bolso e resolve quase toda gravação.

→ [Ver na Amazon](https://link.amazon/B03aah5Na)

## Periféricos

Em breve.`,
    tone: 'butter',
    video_url: null,
    keyword: 'SETUP',
    materials: [],
    chapters: [],
    published_at: '2026-09-14T12:00:00Z',
  },
  {
    slug: 'livros-que-recomendo',
    category: 'Livros',
    topic: null,
    title: 'Livros que recomendo',
    summary: 'Os livros que eu indicaria para quem programa ou quer programar, do primeiro passo até virar um dev melhor.',
    body_md: `*Como associado da Amazon, recebo por compras qualificadas, sem custo extra para você.*

## Fundamentos

### Aprendendo Git
*Anna Skoulikari*

Um guia prático e visual dos fundamentos do Git. Ideal para quem usa Git decorando comandos e quer finalmente entender o que está acontecendo.

→ [Ver na Amazon](https://link.amazon/B0fSnOB1w)

### Introdução à Linguagem SQL
*Thomas Nield*

Direto ao ponto para aprender a consultar e analisar dados com SQL. Uma das habilidades mais úteis para qualquer pessoa de tecnologia.

→ [Ver na Amazon](https://link.amazon/B0im2BWqX)

## Algoritmos e estruturas de dados

### Entendendo Algoritmos
*Aditya Bhargava*

Um guia ilustrado que explica busca binária, recursão, grafos e outros algoritmos com desenhos. O jeito mais leve de aprender um assunto que assusta.

→ [Ver na Amazon](https://link.amazon/B03oZkayS)

### Entendendo Estruturas de Dados
*Marcello La Rocca*

O próximo passo: estruturas de dados mais avançadas aplicadas a problemas reais, mostrando quando e por que usar cada uma.

→ [Ver na Amazon](https://link.amazon/B0eFnuqv3)

## Carreira e boas práticas

### O Programador Pragmático
*Andrew Hunt e David Thomas*

Um clássico que atravessa gerações. Ensina a pensar como um profissional: responsabilidade, código fácil de mudar e aprendizado contínuo.

→ [Ver na Amazon](https://link.amazon/B00QHQaQv)

### O Codificador Limpo
*Robert C. Martin*

Sobre profissionalismo: estimativas, prazos, pressão e como dizer não. Leitura obrigatória para quem quer ser levado a sério.

→ [Ver na Amazon](https://link.amazon/B08Gx7D6r)

### Como Ser Um Programador Melhor
*Pete Goodliffe*

Hábitos e atitudes que separam o bom programador do resto, do código em si ao trabalho em equipe.

→ [Ver na Amazon](https://link.amazon/B06ZZTsi9)`,
    tone: 'peach',
    video_url: null,
    keyword: 'LIVROS',
    materials: [],
    chapters: [],
    published_at: '2026-09-14T11:00:00Z',
  },
]

const project = (p: Partial<Project> & Pick<Project, 'slug' | 'name' | 'type' | 'status' | 'summary' | 'tone' | 'sort'>): Project => ({
  year: null,
  stack: '',
  url: null,
  repo_url: null,
  problem: null,
  solution: null,
  arch: [],
  decisions: [],
  tradeoffs: [],
  readme_md: '',
  ...p,
})

export const seedProjects: Project[] = [
  project({
    slug: 'jornal-tech',
    name: 'O Jornal Tech',
    type: 'Produto',
    status: 'Em construção',
    year: '2026',
    stack: '.NET 8 · Claude API · Next.js · Supabase',
    summary: 'Um jornal de tecnologia e IA que se monta sozinho, em português, a cada duas horas.',
    url: 'https://jornal.heliofilho.dev',
    tone: 'lilac',
    sort: 1,
    problem:
      'Acompanhar IA virou trabalho de tempo integral: dezenas de fontes em inglês, muito ruído e pouca curadoria em português. Eu gastava a manhã lendo e ainda perdia o que importava.',
    solution:
      'Um coletor em .NET roda a cada duas horas, lê 9 feeds RSS e manda cada notícia nova para o Claude, que traduz, resume, classifica e diz se aquilo é notícia de verdade. Quando fontes diferentes falam da mesma coisa, a notícia fica em alta. O site só lê a lista pronta.',
    arch: ['RSS · 9 fontes', 'Coletor .NET (cron 2h)', 'Claude: resumo e prioridade', 'Supabase Postgres', 'jornal.heliofilho.dev'],
    decisions: [
      'Mesmo Supabase deste site, em tabelas separadas: um banco só pra manter.',
      'Worker simples em vez de Clean Architecture: não é um domínio complexo.',
      'Uma chamada ao Claude por notícia, com saída JSON validada.',
      'O que não é notícia fica gravado como oculto, pra não pagar a classificação de novo.',
    ],
    tradeoffs: [
      'Em alta por termos em comum erra quando as manchetes são muito diferentes.',
      'Feed RSS muda sem aviso e precisa de monitoramento.',
      'Atualiza a cada duas horas, não em tempo real.',
    ],
    readme_md: `## Como funciona

1. **Coleta.** 9 feeds RSS (OpenAI, Google DeepMind, The Verge, Ars Technica, MIT Technology Review, Simon Willison, GitHub Blog, Tecnoblog e arXiv), olhando as últimas 48 horas. Oferta e cupom são descartados antes de chegar no modelo.
2. **Sem repetição.** Link que já está no banco não é classificado de novo.
3. **Classificação.** O Claude devolve título e resumo em português, categoria, prioridade e se aquilo deve ser descartado.
4. **Em alta.** Notícias de fontes diferentes que compartilham termos relevantes em até 36 horas.
5. **Site.** Next.js lê do Supabase e se atualiza a cada 10 minutos.

## Onde está o código

Dentro do repositório deste site, na pasta \`jornal/\`: \`collector/\` (o robô em .NET), \`web/\` (o jornal) e \`supabase/\` (as tabelas).

## Próximos passos

- Juntar a mesma notícia vinda de várias fontes num registro só.
- O jogo diário: uma pergunta por dia sobre a edição.`,
  }),
  project({
    slug: 'heliofilho-dev',
    name: 'heliofilho.dev',
    type: 'Produto',
    status: 'Em construção',
    year: '2026',
    stack: 'Next.js · Supabase · Vercel',
    summary: 'Este site: projetos, cofre, jornal e newsletter num lugar só.',
    url: 'https://heliofilho.dev',
    tone: 'mint',
    sort: 2,
    problem:
      'Meu conteúdo estava espalhado entre bio do Instagram, Notion, Substack e links soltos. Quem chegava por um vídeo não achava o resto.',
    solution:
      'Um site só, com o cofre de materiais, os projetos com README e diário, a prévia do jornal e a newsletter. O conteúdo fica no Supabase, então dá pra publicar uma página nova sem novo deploy.',
    arch: ['Next.js (App Router)', 'Supabase Postgres', 'Vercel'],
    decisions: [
      'Conteúdo em tabelas do Supabase: publicar não exige deploy.',
      'Páginas geradas no servidor e atualizadas a cada 5 minutos.',
      'Cada item do cofre tem link curto próprio, pronto pra mandar na DM.',
    ],
    tradeoffs: ['Editar markdown direto na tabela é menos confortável que o Notion.'],
  }),
  project({
    slug: 'cofre',
    name: 'Cofre',
    type: 'Produto',
    status: 'Em construção',
    year: '2026',
    stack: 'Next.js · Supabase',
    summary: 'Biblioteca aberta com repos, livros, equipamento e uma página por vídeo.',
    url: 'https://heliofilho.dev/cofre',
    tone: 'butter',
    sort: 3,
    problem: 'Cada vídeo gera comentários pedindo o link do material, e os materiais viviam soltos no Notion.',
    solution: 'O cofre saiu do Notion e veio pra dentro do site. Cada item tem página própria com link curto, busca e filtro por tipo.',
    arch: ['Supabase (cofre_items)', 'Next.js', 'heliofilho.dev/cofre/[item]'],
    decisions: ['Cada item guarda uma palavra-chave, pensando na automação de DM.', 'Texto em markdown: dá pra escrever do celular.'],
  }),
  project({
    slug: 'planilio',
    name: 'Planilio',
    type: 'SaaS',
    status: 'No ar',
    summary: 'Organize suas finanças e veja como o seu dinheiro vai estar nos próximos 24 meses.',
    url: 'https://planilio.com.br',
    tone: 'sky',
    sort: 4,
  }),
  project({
    slug: 'manychat-proprio',
    name: 'ManyChat próprio',
    type: 'Automação',
    status: 'Ideia',
    stack: 'Instagram Messaging API · Webhooks',
    summary: 'Responder comentários e DMs com o link certo do cofre, sem depender do ManyChat.',
    tone: 'peach',
    sort: 5,
    problem: 'Cada vídeo gera centenas de comentários pedindo o link do material.',
    solution: 'Um webhook recebe a palavra-chave do comentário, acha o item do cofre com aquela palavra e responde por DM com o link da página.',
    arch: ['Instagram', 'Webhook', 'Cofre (palavra-chave)', 'DM com o link'],
  }),
  project({
    slug: 'jogo-diario',
    name: 'Jogo diário',
    type: 'Produto',
    status: 'Ideia',
    stack: 'Next.js · Supabase Auth',
    summary: 'Uma pergunta por dia sobre as notícias do jornal, com ranking semanal.',
    tone: 'rose',
    sort: 6,
    problem: 'Dar um motivo pra voltar ao jornal todo dia.',
    solution: 'Uma pergunta por dia gerada a partir das notícias da edição, com login por link mágico e ranking semanal.',
  }),
]

export const seedUpdates: ProjectUpdate[] = [
  {
    id: 1,
    project_slug: 'heliofilho-dev',
    title: 'Novo layout e o cofre dentro do site',
    body_md:
      'O site ganhou o layout novo e o cofre saiu do Notion: repos, livros, equipamento e a página de cada vídeo agora moram aqui, cada um com link próprio.',
    published_at: '2026-09-30T12:00:00Z',
  },
]
