# Handoff: Jornal Tech (jornal.heliofilho.dev)

## Overview
Capa diária de notícias de tecnologia/IA, curada automaticamente pelo coletor .NET (`NewsCollectorService` / `DailyDigestBuilder`) e revisada à mão. Produto **separado** do portfólio: projeto Vercel próprio no subdomínio `jornal.heliofilho.dev`, banco Supabase próprio.

## About the Design Files
`Jornal Tech v3.dc.html` é uma **referência de design em HTML**, não código de produção. Recriar em **Next.js (App Router)** novo — mesmo stack do portfólio. Abra o arquivo no navegador (com `support.js` ao lado) para ver filtros e animações.

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamentos e interações são finais. Notícias, fontes e números são placeholders — ligar no output do coletor.

## Stack recomendado
- Frontend: Next.js na Vercel (projeto separado), ISR revalidando às 7h e 18h.
- Coletor: worker .NET 8 em Docker, rodando como cron 2x/dia (Railway Cron, Fly.io ou similar).
- Banco: Supabase Postgres **novo, separado** do portfólio. Tabela sugerida `news_items(id, title, deck, body, category, priority, sources text[], source_count, trending bool, published_at, edition_date)`.
- Newsletter: Supabase (tabela `subscribers`); Auth/magic link só quando o jogo diário tiver ranking.
- Imagens/charge: Supabase Storage.

## Design Tokens
| Token | Hex |
|---|---|
| fundo externo | `#EEE9DE` |
| papel | `#FBF8F1` + pontilhado `radial-gradient(rgba(26,24,20,.025) 1px, transparent 1px)` 5px |
| ink | `#2A2722` |
| fio fino | `#E2DACA` |
| borda de box | `#DDD4C2` |
| vermelho editorial (kicker, "em alta") | `#C4584C` |
| cotação ▲ | `#2F6B3F` |
| accent ("Tech", links do site) | `#4F46C8` |
| foto (retícula) | bg `#E4DEF7` + dots `rgba(79,70,200,.28)` 7px |
| charge | bg `#F5EDC6`, tracejado `rgba(122,100,32,.4)`, texto `#7A6420` |

**Fontes (Google):** Instrument Serif 400/italic (nome, manchetes, números) · Libre Caslon Text 400/700/italic (corpo) · Geist Mono 400/500 (labels uppercase, 10.5–13px, ls .12–.16em).

**Folha:** `max-width:1280px; border-radius:20px; padding:28px 44px 40px; box-shadow: 0 30px 60px -34px rgba(26,24,20,.3), 0 1px 3px rgba(26,24,20,.08)`.

## Layout (de cima pra baixo)
1. **Linha superior** mono 11px: "← heliofilho.dev" (nowrap) / "jornal.heliofilho.dev".
2. **Cabeçalho** (flex-wrap, centralizado): nome "O Jornal *Tech*" Instrument Serif `clamp(52px,10vw,128px)`, lh .92, ls -.03em, nowrap, "Tech" em accent; frase itálica 15px (margin-top 14px). Dois boxes 170px (radius 12px, bg papel, borda box): "Edição das 7h" e "Preço · R$ 0,00 · para sempre" — ficam abaixo do nome.
3. **Faixa de data**: fio 1.5px + fio 1px; itens mono 12px nowrap: "Ano I · Nº 212" / data por extenso / "14 notícias · 4 em alta".
4. **Nav de categorias**: Tudo, IA, Dev, Tech, BR, Pesquisa — mono 13px, separados por `border-right`; ativo = vermelho + sublinhado (offset 5px). Toggle "● Só em alta" em vermelho.
5. **Corpo** (flex-wrap, gap 32px 28px):
   - **Manchete** `flex:2 1 560px`: kicker mono vermelho ("Urgente · IA"), título serif `clamp(40px,5.4vw,70px)` lh .98 balance, linha fina itálica 20px, byline mono entre fios ("Por robô coletor · revisado por Hélio Filho · fontes"), foto 16:8 radius 14 com retícula + legenda itálica 12.5px, corpo em **2 colunas** (gap 28px, column-rule fio fino), 15.5px/1.62, justificado, hifenização, **capitular** serif 66px float.
   - **Lateral** `flex:1 1 280px; border-left:1px fio fino; padding-left:28px`:
     - "Em alta": top 4 por nº de fontes, número serif 30px + título serif 17px + "N fontes".
     - "Cotação das fontes": linhas pontilhadas, nome + "▲/▼/■ N" (hoje vs ontem).
     - "A charge": quadro 1:1 + "— por Hélio".
6. **Notícias secundárias**: grid `auto-fit minmax(240px,1fr)`, cada uma com `border-left` fino, kicker (vermelho se alta), título serif 22px, linha fina 14.5px justificada, "fontes · hora" itálico.
7. **Classificados**: título serif itálico 26px entre fios; grid de 4 boxes (radius 14px, bg papel, borda box): **Assina-se** (input + botão pílula escuro "Assinar" → "Assinatura confirmada. Até sexta."), **Procura-se** (jogo diário, em breve), **Doa-se** (link pro cofre), **Anuncie** (media kit).
8. **Rodapé**: fio + duas frases itálicas 12px.

## Regras de dados
- **Prioridade**: alta (lançamento de player grande, regulação, breakthrough) · média (ferramenta dev, funding, runtime) · baixa (nicho, opinião, incremental).
- **Em alta**: mesma notícia em 2+ fontes no mesmo dia (`TrendingDetector`).
- **Ordenação**: prioridade (alta→baixa), depois nº de fontes desc. A primeira vira a manchete; o resto vai para a linha de notícias secundárias.
- **Kicker**: "Urgente · {cat}" se alta e em alta; "Em alta · {cat}" se média/baixa e em alta; senão só a categoria.
- Fontes monitoradas: Anthropic News, OpenAI Blog, Google DeepMind, The Verge, Ars Technica, MIT Tech Review, Simon Willison, GitHub Blog, Tecnoblog, arXiv cs.AI.

## Interactions
- Filtro por categoria + toggle "só em alta" (combináveis); estado vazio: "Nenhuma notícia com esse filtro nesta edição."
- Reveal no scroll: `opacity 0→1`, `translateY 14px→0`, 0.9s, stagger 70ms; fallback revela tudo após 1.5s; respeitar `prefers-reduced-motion`.

## Files
- `Jornal Tech v3.dc.html` — protótipo da capa.
- `support.js` — runtime só para abrir o protótipo (não usar no app).
