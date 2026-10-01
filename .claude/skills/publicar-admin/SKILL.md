---
name: publicar-admin
description: Publica ou edita um item do Cofre ou um Projeto no /admin de heliofilho.dev direto no site em produção, via navegador automatizado (o painel não tem API).
---

# Publicar no /admin de heliofilho.dev

Automatiza o preenchimento do painel `/admin` (Cofre e Projetos) via Playwright, porque esse painel não tem API: só existe a UI web mesmo. Isso evita reconstruir o script de automação do zero a cada post - os seletores e as armadilhas já estão mapeados em `helpers.mjs`, nessa mesma pasta.

## Quando usar

O usuário pede pra publicar, editar ou "subir" algo no Cofre (`/cofre`) ou em Projetos (`/projetos`) do site heliofilho.dev.

## Antes de começar

1. **Senha do admin**: peça ao usuário (`ADMIN_PASSWORD`), nunca assuma ou reuse uma de sessão anterior. Salve num arquivo temporário dentro do scratchpad da sessão (ex.: `scratchpad/admin/.pw`), **nunca** dentro do repositório. Apague esse arquivo assim que terminar de publicar (sucesso ou falha).
2. **Conteúdo**: se o usuário não mandou o texto já pronto pros campos (título, resumo, corpo etc.), escreva você mesmo seguindo o tom do resto do site (ver `frontend/components/admin/CofreEditor.tsx` e `ProjectEditor.tsx` pros campos exatos, e itens publicados existentes como referência de tom - direto, sem hype, português do Brasil).
3. **Imagens/vídeo**: eu não tenho ferramenta de gerar imagem aqui. Se o post precisar de foto/thumbnail/vídeo, avise o usuário que esses campos ficam vazios e ele sobe manualmente depois pelo próprio `/admin` (os campos de mídia aceitam arrastar arquivo ou colar link).

## Fluxo

1. `import { chromium } from PLAYWRIGHT_CORE_ENTRY` (de `helpers.mjs`) - é o Playwright que já vem com o `@playwright/mcp` instalado globalmente; não tem `playwright` no `node_modules` do projeto, não adianta importar `'playwright-core'` puro (dá `ERR_MODULE_NOT_FOUND`).
2. `login(page, password)`.
3. Item **novo**: `page.goto('https://heliofilho.dev/admin/cofre/novo')` ou `/admin/projetos/novo`.
   Item **existente**: `.../admin/cofre/<slug>` ou `.../admin/projetos/<slug>` (descobre o slug na URL pública, ex. `heliofilho.dev/cofre/<slug>`).
4. `await page.waitForSelector(...)` em algum campo estável da página, depois **`await page.waitForTimeout(500)`** - corrida de hidratação, ver nota em `helpers.mjs`.
5. Preenche com `fillSafe()` (campos de texto simples) e `fillListField()` (listas). Ver mapa de campos abaixo.
6. Tira screenshot (`page.screenshot(..., fullPage: true)`) e **leia a imagem com a tool Read antes de salvar** - confere visualmente que nada ficou vazio ou duplicado. Isso já pegou bug de verdade (ver histórico: um fill que não colou, uma ambiguidade de seletor que preencheu o campo errado).
7. Se for item novo e ainda não tiver sido publicado antes, confira o toggle "Rascunho"/"Publicado" no topo do painel lateral - **não assuma**; só clica pra publicar se o usuário quer o item visível já.
8. `saveAndVerify(page, outDir, nome)` - salva e confere o toast.
9. Depois de salvar: visite a página pública e **role de verdade** antes de tirar o screenshot final (`page.mouse.wheel(0, 400)` em loop) - as seções usam reveal-on-scroll (`[data-reveal]`, ver `frontend/lib/useReveal.ts`); um screenshot sem rolar mostra a página "vazia" mesmo com o conteúdo lá, isso já gerou falso alarme antes.
10. Apague o arquivo de senha.

## Mapa de campos

### Cofre (`CofreEditor.tsx`)

| Campo | Seletor |
|---|---|
| Título | `input[placeholder^="Título"]` |
| Resumo | `textarea[placeholder^="Resumo curto"]` |
| Tipo (categoria) | único `<select>` da página - `page.selectOption('select', { label: 'Vídeos' })` |
| Corpo | `textarea[placeholder^="Conteúdo da página"]` |
| Tema | `input[list="cofre-topics"]` |
| Link (slug) | `div:has(> span:text-is("/cofre/")) input` |
| Palavra-chave da DM | `input[placeholder="REPOS"]` |
| Vídeo (categoria Vídeos) | 1º `input[placeholder="ou cole um link (https://…)"]` (há 2 na página quando é vídeo: vídeo e thumbnail - use `.nth(0)`) |
| Thumbnail/capa | mesmo placeholder, `.nth(1)` quando é vídeo; único quando não é |
| Materiais do vídeo | `fillListField(page, 'Materiais do vídeo', [[nome, detalhe, link], ...])` |

### Projeto (`ProjectEditor.tsx`)

| Campo | Seletor |
|---|---|
| Nome | `input[placeholder="Nome do projeto"]` |
| Resumo | `textarea[placeholder^="Uma frase"]` |
| O problema | `label:has-text("O problema") textarea` |
| A solução | `label:has-text("A solução") textarea` |
| Arquitetura | `fillListField(page, 'Arquitetura', [texto, texto, ...])` |
| Decisões técnicas | `fillListField(page, 'Decisões técnicas', [...])` |
| Trade-offs | `fillListField(page, 'Trade-offs', [...])` |
| README | `textarea[placeholder^="Explique o projeto"]` |
| Tipo | `input[placeholder="Produto"]` |
| Ano | `input[placeholder="2026"]` |
| Stack | `input[placeholder="Next.js · Supabase"]` |
| Link no ar | `input[placeholder="https://…"]` (exato - não confundir com o do GitHub, que tem placeholder diferente) |
| GitHub | `input[placeholder="https://github.com/…"]` |

Se o projeto tiver repo público no GitHub, prefira clicar em "↓ Importar README do GitHub" (`button:has-text("Importar README")`) em vez de digitar o README na mão.

## Depois de publicar

Sempre relate ao usuário: o que foi publicado, o link público, e **o que ficou faltando** (imagem, vídeo, thumbnail) pra ele completar manualmente. Nunca deixe implícito que algo "ficou pronto" se um campo de mídia continua vazio.
