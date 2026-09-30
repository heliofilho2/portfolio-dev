-- SINAL: tabelas novas no MESMO Supabase do portfólio (projeto qnjrobyvhaoxcqhinsov).
-- Nomes em snake_case, sem colidir com as tabelas do EF Core (Profiles, Projects, Skills, Experiences).
-- Rodar uma vez no SQL Editor do projeto.
-- A newsletter fica no Substack (heliofilhou.substack.com), não aqui.

create table if not exists news_items (
  id               bigint generated always as identity primary key,
  url              text not null unique,
  title            text not null,
  title_pt         text not null,
  source           text not null,
  published_at     timestamptz not null,
  summary_pt       text not null,
  category         text not null check (category in ('IA', 'Big Tech', 'Dev Tools', 'Linguagens', 'Pesquisa', 'Outro')),
  topics           text[] not null default '{}',
  priority         text not null check (priority in ('alta', 'media', 'baixa')),
  priority_reason  text not null default '',
  trending         boolean not null default false,
  hidden           boolean not null default false, -- descartado pelo classificador (oferta, tutorial etc.)
  -- Matéria completa (NewsWriter), só pra prioridade alta ou em alta: null = ainda não tentado,
  -- '' = tentado e sem texto-fonte suficiente (fonte bloqueou o acesso, paywall etc.), texto = publicado.
  body_pt          text,
  collected_at     timestamptz not null default now()
);

-- Idempotente pra quem já rodou este arquivo antes da coluna existir.
alter table news_items add column if not exists body_pt text;

create index if not exists news_items_published_at_idx on news_items (published_at desc);

-- RLS: o site (chave anon) só lê notícias.
-- O coletor conecta direto no Postgres com o usuário do banco, que ignora RLS.
alter table news_items enable row level security;

drop policy if exists "leitura publica" on news_items;
create policy "leitura publica" on news_items for select to anon using (not hidden);
