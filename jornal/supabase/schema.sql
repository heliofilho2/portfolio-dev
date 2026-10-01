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
  -- og:image da página original, pega junto com a extração do texto (ArticleExtractor). Só
  -- preenchida pra prioridade alta/em alta, igual body_pt — null quando não achou ou não tentou.
  image_url        text,
  collected_at     timestamptz not null default now()
);

-- Idempotente pra quem já rodou este arquivo antes da coluna existir.
alter table news_items add column if not exists body_pt text;
alter table news_items add column if not exists image_url text;

create index if not exists news_items_published_at_idx on news_items (published_at desc);

-- RLS: o site (chave anon) só lê notícias.
-- O coletor conecta direto no Postgres com o usuário do banco, que ignora RLS.
alter table news_items enable row level security;

drop policy if exists "leitura publica" on news_items;
create policy "leitura publica" on news_items for select to anon using (not hidden);

-- Extras do dia: charge (sobe manual no /admin) e a pergunta do jogo diário.
-- Uma linha por dia; "hoje" é só a linha com date = current_date no fuso de São Paulo.
create table if not exists jornal_extras (
  date              date primary key,
  charge_url        text,
  charge_caption    text,
  trivia_question   text,
  trivia_correct    text,
  trivia_wrong      text[] not null default '{}', -- 2 a 3 alternativas erradas
  created_at        timestamptz not null default now()
);

alter table jornal_extras enable row level security;

drop policy if exists "leitura publica extras" on jornal_extras;
create policy "leitura publica extras" on jornal_extras for select to anon using (true);
