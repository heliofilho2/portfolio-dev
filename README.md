# heliofilho.dev

Site pessoal do Helio Filho: hub com produtos, canais de conteúdo, redes sociais e portfólio técnico (projetos, experiência e stack).

- **Frontend:** Next.js 16 (App Router, Server Components + ISR), React 19, Tailwind CSS v4 — deploy na Vercel
- **Backend:** .NET 8 Web API em Clean Architecture (Domain → Application → Infrastructure → API) — deploy no Railway (Docker)
- **Banco:** PostgreSQL no Supabase, via EF Core + Npgsql

## Como o conteúdo é dividido

| Conteúdo | Onde fica | Como editar |
|---|---|---|
| Bio, números, produtos, canais, redes, currículos | `frontend/lib/hub.ts` (estático) | Editar o arquivo e fazer deploy |
| Perfil, projetos (estudos de caso), experiência, skills | Supabase, servido pela API | SQL no Supabase ou endpoints POST/PUT da API |

A home e a página Sobre são geradas estáticas e revalidadas a cada 5 minutos. Se a API cair, o hub estático continua no ar; só as seções vindas da API somem.

## Estrutura

```
frontend/
  app/                  páginas (/, /about, /projects/[id], /maintenance), sitemap, robots, 404
  components/home/      seções da home (Hero, Stats, Products, Channels, Projects, Experience, Stack)
  components/layout/    Header, Footer, ThemeToggle
  components/projects/  estudo de caso do projeto
  lib/hub.ts            conteúdo estático do hub
  lib/api.ts            cliente da API
  proxy.ts              modo manutenção
backend/
  Portfolio.Domain/          entidades
  Portfolio.Application/     DTOs, serviços, interfaces
  Portfolio.Infrastructure/  DbContext, repositórios, migrations
  Portfolio.API/             controllers, middleware de API key, Program.cs
  SEED_CONTEUDO_PT.sql       carga do conteúdo atual (PT-BR)
jornal/
  collector/, web/, supabase/  SINAL — jornal de tech/IA em jornal.heliofilho.dev, ver jornal/README.md
```

O `jornal/` é outro produto: Vercel e Railway próprios (root directory `jornal/web` e `jornal/collector`), mas usa o mesmo Supabase do portfólio (tabelas `news_items` e `subscribers`, sem colidir com as do EF Core). Detalhes em [jornal/README.md](jornal/README.md).

## Rodando localmente

**Backend** (porta 5115, Swagger em `/swagger`):

```bash
cd backend/Portfolio.API
# connection string em appsettings.Development.json (gitignored) ou na env var DATABASE_CONNECTION_STRING
dotnet run
```

**Frontend** (porta 3000):

```bash
cd frontend
npm install
echo NEXT_PUBLIC_API_URL=http://localhost:5115/api > .env.local
npm run dev
```

## Variáveis de ambiente

| Onde | Variável | Descrição |
|---|---|---|
| Vercel | `NEXT_PUBLIC_API_URL` | URL da API, terminando em `/api` |
| Vercel | `MAINTENANCE_MODE` | `true` redireciona tudo para `/maintenance`. Qualquer outro valor (ou ausente) = site normal |
| Railway | `DATABASE_CONNECTION_STRING` | Connection string do Supabase (formato URI do Session Pooler) |
| Railway | `API_KEY` | Protege POST/PUT/DELETE (header `X-API-Key`). Nunca versionar |
| Railway | `PORT` | Injetada pelo Railway |

## Migrations

O histórico do EF está sincronizado com o banco. Para mudar o schema:

```bash
dotnet tool install --global dotnet-ef   # se ainda não tiver
cd backend/Portfolio.Infrastructure
dotnet ef migrations add NomeDaMudanca --startup-project ../Portfolio.API
dotnet ef database update --startup-project ../Portfolio.API
```

Evite alterar o schema direto no Supabase: o EF perde o controle e a próxima migration quebra.

Deploy e troubleshooting: ver [DEPLOY.md](DEPLOY.md).
