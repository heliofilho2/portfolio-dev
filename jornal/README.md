# SINAL — Jornal de Tecnologia e IA

Curadoria diária de IA e tecnologia, sem sensacionalismo, em `jornal.heliofilho.dev`.

Vive dentro do repositório `portfolio-dev` (mesmo Supabase do portfólio), mas roda como serviços
próprios: segundo projeto na Vercel e segundo serviço no Railway, cada um apontando para a pasta
correspondente aqui dentro.

```
jornal/
  collector/   .NET 8 — lê RSS, classifica com Claude, grava no Supabase (Railway Cron, a cada 2h)
  web/         Next.js 16 — o jornal (Vercel, subdomínio jornal.heliofilho.dev), ISR de 10 min
  supabase/    schema.sql da tabela do jornal (news_items)
```

## Como funciona

1. **Coleta:** 9 feeds RSS (`collector/Models.cs`), últimas 48h, com limite por fonte. Ofertas óbvias ("R$", "cupom", "OFF") são descartadas antes de chegar ao modelo.
2. **Dedupe:** URLs já gravadas não são reclassificadas.
3. **Classificação:** uma chamada ao Claude por notícia, com saída JSON validada por schema: título e resumo em PT, categoria, até 3 tópicos (lista fechada), prioridade e `discard` para o que não é notícia (gravado como `hidden`, para não ser pago de novo).
4. **Em alta:** notícias de fontes diferentes que compartilham 2+ termos relevantes em 36h (compara título original e traduzido).
5. **Site:** destaque do dia, coluna com a última edição da newsletter (RSS do Substack), filtros por categoria/tópico e captura de e-mail.

## Setup (uma vez)

**1. Banco — tabelas novas no Supabase do portfólio**
- Abra o projeto Supabase do portfólio (`qnjrobyvhaoxcqhinsov`) → **SQL Editor** → rode `supabase/schema.sql`.
- Anote, em **Project Settings → API**: Project URL e a chave `anon public` (é diferente da connection string que o backend .NET usa).
- A connection string do coletor é a mesma `DATABASE_CONNECTION_STRING` já usada pelo Railway do backend.

**2. Coletor no Railway** — no mesmo projeto Railway do portfólio, novo serviço a partir deste repositório:
- Root Directory: `jornal/collector` (o `railway.toml` já define Dockerfile e o cron `0 */2 * * *`)
- Variáveis:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | a mesma connection string do Supabase que o backend usa |
| `ANTHROPIC_API_KEY` | chave da API da Anthropic |
| `CLAUDE_MODEL` | opcional; padrão `claude-opus-5` |
| `LOOKBACK_HOURS` | opcional; padrão `48` |

**3. Site na Vercel** — novo projeto a partir deste MESMO repositório (`portfolio-dev`), não confundir com o projeto do `frontend/`:
- Root Directory: `jornal/web`
- Variáveis: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (do passo 1)
- Domínio: adicionar `jornal.heliofilho.dev` nas Settings → Domains do projeto (é grátis; a Vercel só pede um registro DNS no seu provedor de domínio)

## Rodando localmente

```bash
# Testa os feeds sem chamar Claude nem banco
cd jornal/collector && dotnet run -- --dry-run

# Execução real
DATABASE_URL=... ANTHROPIC_API_KEY=... dotnet run

# Site (sem variáveis do Supabase, mostra dados de exemplo)
cd jornal/web && npm install && npm run dev
```

## Custo

O coletor só classifica o que é novo — tipicamente 50 a 150 notícias por dia no total, não por execução. O log final de cada execução mostra os tokens usados. Para gastar menos, troque `CLAUDE_MODEL` por `claude-sonnet-5` ou `claude-haiku-4-5`.

## Próximas camadas (brief)

- Roteiro de vídeo a partir das notícias de prioridade alta
- Extras de jornal: sudoku diário, quiz de 5 perguntas, charge com personagem fixo
- Resumo semanal do jornal na newsletter do Substack
