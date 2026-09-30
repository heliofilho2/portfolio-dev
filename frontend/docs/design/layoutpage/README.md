# Handoff: heliofilho.dev (site pessoal) + jornal.heliofilho.dev (Jornal Tech)

## Overview
Redesign do portfólio `portfolio-dev` (Next.js 16 / React 19 + API .NET 8). O site deixa de ser só portfólio de programador e vira o **hub pessoal de um criador de conteúdo tech**: bio, redes, reels, projetos (com case study), cofre de materiais no Notion, página por vídeo, newsletter, media kit/contato e um **Jornal Tech** diário num subdomínio separado.

## About the Design Files
Os arquivos `.dc.html` deste pacote são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento, **não código de produção para copiar**. A tarefa é **recriar esses designs no app Next.js existente** (`frontend/`, App Router), usando os padrões do repo (componentes por seção, `lib/api.ts`). Abra os `.dc.html` no navegador (com `support.js` ao lado) para ver o comportamento. Todo o estilo está inline; converta para o sistema de estilo do projeto (CSS Modules/Tailwind — o que o repo já usar; se nada, Tailwind é recomendado).

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamentos, raios, sombras e interações são finais. Recriar pixel-perfect. Conteúdo (números, títulos, notícias, reels) é **placeholder** — ligar em dados reais.

---

## Rotas sugeridas (Next.js App Router)

| Rota | Tela no protótipo | Fonte de dados |
|---|---|---|
| `/` | Home | API (profile, projects), Notion (cofre), Jornal (top 4), Instagram (reels) |
| `/sobre` | Sobre | API `Profile`, `Experience`, `Skill` |
| `/projetos` | Projetos (lista com filtros) | API `Project` |
| `/projetos/[id]` | Case study | API `Project` (campos BusinessProblem, TechnicalSolution, TechnicalDecisions, TradeOffs, ArchitectureNotes) |
| `/cofre` | Cofre (grid + filtros + busca) | Notion API |
| `/cofre/videos/[slug]` | Página do vídeo | Notion API |
| `/newsletter` | Newsletter | Supabase (captura de e-mail) |
| `jornal.heliofilho.dev` | Jornal Tech v3 | Projeto Vercel separado; lê `DailyDigestBuilder` do coletor |

Remover o modo manutenção (`proxy.ts` / `MAINTENANCE_MODE`) ao publicar.

---

## Design Tokens

### Cores — site pessoal
| Token | Hex | Uso |
|---|---|---|
| bg | `#F6F3EC` | fundo da página |
| surface | `#FCFAF6` | cards |
| ink | `#1E1C19` | texto principal, bordas fortes, botões escuros |
| ink-2 | `#3E3A34` | corpo longo |
| muted | `#5E5950` | texto secundário |
| subtle | `#8A8378` | labels mono, metadados |
| line | `#E4DDD0` | divisórias, bordas de card |
| chip | `#EDE8DE` | chip inativo / nav ativo |
| accent | `#4F46C8` | links, *itálicos* de destaque nos títulos |
| hand | `#D0655A` | anotações manuscritas |
| lilac | `#E4DEF7` | pastel |
| mint | `#DDEEE2` | pastel / status "No ar" |
| peach | `#F7E1D3` | pastel / media kit |
| butter | `#F5EDC6` | pastel / status "Em construção" |
| sky | `#DCE8F3` | pastel / status "Ideia" |
| rose | `#F4D9DC` | pastel |
| prio alta / média / baixa | `#E07A6E` / `#D9B44A` / `#B8B2A7` | bolinhas de prioridade |
| online dot | `#7BB58E` | indicador ao lado do avatar |

### Cores — Jornal
paper `#FBF8F1` (com pontilhado `radial-gradient(rgba(26,24,20,.025) 1px, transparent 1px)` 5px), fundo externo `#EEE9DE`, ink `#2A2722`, fio fino `#E2DACA`, box `#DDD4C2`, vermelho editorial `#C4584C`, alta verde (cotação) `#2F6B3F`, accent `#4F46C8`.

### Tipografia (Google Fonts)
- **Instrument Serif** 400 (+ italic) — títulos/display. H1 hero `clamp(60px, 9vw, 112px)` / lh .88 / ls -.03em. H2 de seção 52px / lh 1 / ls -.02em. Palavra em destaque em `<em>` com cor accent.
- **Geist** 400/500/600 — UI e corpo. Corpo 15–19px, lh 1.55.
- **Geist Mono** 400/500 — labels uppercase 10.5–12px, ls .1–.14em, cor subtle. Ex.: `01 · Instagram`.
- **Caveat** 500/700 — anotações à mão, 24–30px, cor hand, `rotate(-2deg a -4deg)`. **Máximo 1 por seção.**
- Jornal: **Instrument Serif** (manchetes), **Libre Caslon Text** (corpo, justificado, 2 colunas), **Geist Mono** (labels).

### Raios / sombras
- Pílulas e botões: `999px`. Cards: 16–22px. Blocos grandes (newsletter, media kit): 28px.
- Sombra "dura" discreta: `3px 3px 0 #1E1C19` (hover `5px 5px 0` + `translate(-2px,-2px)`); blocos grandes `4px 4px 0` com `border:1px solid #1E1C19`.
- Sombra suave (hover de cards claros): `0 16px 32px -22px rgba(30,28,25,.4)`.
- Cofre: canto dobrado — `border-radius: 18px 4px 18px 18px` + triângulo 24px no canto sup. direito `linear-gradient(225deg, #F6F3EC 50%, #E9E2D4 50%)`.

### Layout
Container `max-width: 1200px; padding: 0 32px`. Seções `padding: 56px 0` separadas por `border-top: 1px solid #E4DDD0`. Grids com `repeat(auto-fill/auto-fit, minmax(min(100%, Npx), 1fr))`; nada de largura fixa.

---

## Screens

### Header (todas as páginas)
Sticky, `background: rgba(246,243,236,.86)` + `backdrop-filter: blur(14px)`, borda inferior line. Logo "helio*filho*.dev" em Instrument Serif 27px. Nav em pílulas (Início, Sobre, Projetos, Cofre, Newsletter) — ativa com bg chip. Link "Jornal ↗" com bolinha `#E07A6E` → subdomínio. CTA escuro "Assinar newsletter" (nowrap).

### Home (`/`)
1. **Faixa de edição** (mono 11px, nowrap por item): "Edição nº X · data" / "Tecnologia, IA e código — em português" / "Hoje no jornal: N notícias ↗".
2. **Hero centralizado**: avatar 136px redondo (borda 4px surface + anel line + dot online), "oi! eu sou o" (Caveat), H1 "Hélio *Filho*", bio 19px max 560px, pílulas de redes coloridas (Instagram, TikTok, LinkedIn, GitHub, YouTube "em breve"), e-mail com botão **Copiar** (vira "Copiado ✓" por 1.6s) + link "Assinar a carta de sexta →".
3. **Reels recentes + Hoje no jornal** (flex-wrap: reels `flex:2 1 520px`, jornal `flex:1 1 300px`): cards verticais 9:14 com sombra dura, views e título; anotação "YouTube vem aí!". Card do jornal com 4 manchetes (bolinha de prioridade + meta mono) e botão accent "Abrir o jornal completo →".
4. **O que eu construo**: lista de linhas (nº, ícone 56px pastel com inicial em serif itálico, nome/desc/stack, pílula de status). Hover `translateX(4px)` + borda ink. Clique → case study.
5. **Materiais gratuitos (cofre)**: grid de cards com canto dobrado, ícone redondo pastel, título serif 24px, tag "NOVO" `#E07A6E`.
6. **Newsletter**: bloco lilac 28px com borda/sombra dura, título "Uma carta por semana. *Sem enrolação.*", input em pílula + "Assinar" → estado de sucesso "Pronto, tá dentro. ✓".
7. **Redes**: grid de cards pastel (nome ↗, número serif 36px, handle mono), hover sobe 4px.
8. **Parcerias + Contato**: 2 cards (media kit peach com sombra dura; contato surface com lista de links).
9. **Footer**: wordmark gigante `clamp(48px, 8vw, 112px)` + links mono.

### Sobre / Projetos / Case study / Cofre / Vídeo / Newsletter
Ver o protótipo (navegação pelo header). Destaques:
- **Projetos**: chips de filtro (Tudo, Produto, Automação, Open source) — ativo `#1E1C19`/texto claro.
- **Case study**: título serif 92px, faixa de metadados (Tipo/Stack/Ano/Links), hero pastel com inicial gigante, seções Problema / Solução (grid label + texto 18px), **Arquitetura** como chips mono ligados por "→", cards Decisões (mint) e Trade-offs (peach). Mapeia 1:1 nos campos de case study já existentes na entidade `Project`.
- **Cofre**: filtros por tipo + busca por texto (filtra título+descrição); itens de vídeo levam à página do vídeo, outros abrem o Notion.
- **Página do vídeo**: player 16:9, capítulos (timestamp accent + label), sidebar sticky com "Materiais do vídeo", aviso "Salvo no cofre" e CTA newsletter.

### Jornal Tech (`jornal.heliofilho.dev`)
Folha de papel (radius 20px, sombra suave) sobre fundo `#EEE9DE`.
- Cabeçalho: "O Jornal *Tech*" Instrument Serif `clamp(52px,10vw,128px)` nowrap; frase em itálico; dois boxes (Edição das 7h / Preço R$ 0,00) que descem abaixo do título quando falta espaço.
- Faixa de data entre fio 1.5px + fio 1px (Ano · Nº / data / contagem).
- Nav de categorias (Tudo, IA, Dev, Tech, BR, Pesquisa) com separadores verticais; ativa = vermelho sublinhado. Toggle "● Só em alta".
- **Manchete** (`flex:2 1 560px`): kicker vermelho ("Urgente · IA"), título serif 70px, linha fina italic, byline mono entre fios, foto com retícula lilás, corpo em **2 colunas justificadas com capitular** (serif 66px float).
- **Lateral** (`flex:1 1 280px`, `border-left`): "Em alta" numerado, "Cotação das fontes" (▲ verde / ▼ vermelho / ■ igual vs ontem), quadro da charge (butter, tracejado).
- Linha de notícias secundárias em colunas com `border-left`.
- **Classificados**: Assina-se (newsletter), Procura-se (jogo diário — em breve), Doa-se (cofre), Anuncie (media kit).

---

## Interactions & Behavior
- **Reveal no scroll**: elementos com `data-reveal` começam `opacity:0; translateY(18px)` e entram com `transition: opacity .8s, transform .8s cubic-bezier(.2,.7,.2,1)`, stagger 80ms, via IntersectionObserver (threshold .08). Fallback: revelar tudo após 1.5s. Respeitar `prefers-reduced-motion`. (Em React: um hook `useReveal()` ou Framer Motion `whileInView`.)
- Hovers: 0.25–0.35s; cards sobem 3–4px ou deslocam sombra dura.
- Copiar e-mail: `navigator.clipboard.writeText` com `.catch()`; label muda por 1.6s.
- Newsletter: validar e-mail, POST para Supabase, estado de sucesso inline.
- Jornal: ordenação por prioridade (alta → média → baixa) e depois nº de fontes; **em alta = mesma notícia em 2+ fontes no dia** (já calculado pelo `TrendingDetector`).

## State
Home: `email`, `subscribed`, `copied`. Projetos: `filter`. Cofre: `typeFilter`, `query`. Jornal: `category`, `onlyTrending`.

## Assets
- `assets/helio.jpg` — foto do Hélio (hero, sobre).
- Thumbs de reels, prints de projeto, imagens do jornal e charge: **placeholders** — substituir por imagens reais.

## Files
- `Heliofilho.dev v4.dc.html` — site pessoal completo (todas as páginas, navegação interna).
- `Jornal Tech v3.dc.html` — capa do jornal.
- `support.js` — runtime só para abrir os protótipos no navegador (não usar no app).
