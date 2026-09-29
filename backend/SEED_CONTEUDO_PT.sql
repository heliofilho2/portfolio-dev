-- ============================================
-- Recarga do conteúdo do portfólio em português
-- ============================================
-- Rodar no Supabase SQL Editor. Tudo roda numa transação: se algo falhar, nada muda.
-- Cria backup das tabelas antes de apagar (tabelas _bkp_*_20260929).
-- Para desfazer: TRUNCATE nas tabelas e INSERT INTO "X" SELECT * FROM "_bkp_X_20260929".
-- ============================================

BEGIN;

-- 1. Backup
CREATE TABLE IF NOT EXISTS "_bkp_Profiles_20260929"    AS SELECT * FROM "Profiles";
CREATE TABLE IF NOT EXISTS "_bkp_Projects_20260929"    AS SELECT * FROM "Projects";
CREATE TABLE IF NOT EXISTS "_bkp_Skills_20260929"      AS SELECT * FROM "Skills";
CREATE TABLE IF NOT EXISTS "_bkp_Experiences_20260929" AS SELECT * FROM "Experiences";

-- 2. Limpa tudo e reinicia os IDs
TRUNCATE "Profiles", "Projects", "Skills", "Experiences" RESTART IDENTITY;

-- 3. Perfil
INSERT INTO "Profiles" (
  "Name", "Role", "Location", "Languages", "Description", "AvatarUrl", "ExperienceYears",
  "CoreEngine", "Database", "Email", "GitHubUrl", "LinkedInUrl", "Specialized", "Certifications",
  "AboutText", "CreatedAt", "IsDeleted"
) VALUES (
  'Helio Filho',
  'Desenvolvedor .NET | Integrações ERP & SAP Business One',
  'Itajubá, MG',
  'Português / Inglês',
  $$Desenvolvedor backend com mais de 5 anos de experiência construindo serviços de automação resilientes e sistemas corporativos de alta confiabilidade. Forte atuação em integrações com ERP, processamento em segundo plano e bancos de dados otimizados para performance, usando C# e .NET. Desenho soluções backend escaláveis que reduzem risco operacional e aumentam a confiabilidade dos sistemas.$$,
  '/avatar.jpg',
  '+5 anos',
  'C# / .NET / SAP B1 / Python',
  'HANA / SQL Server / Supabase',
  'heliofilho.contato@outlook.com',
  'https://github.com/heliofilho2',
  'https://www.linkedin.com/in/heliofilhoo/',
  'Integrações ERP e automação operacional com .NET',
  'Pós-graduação em Administração de Banco de Dados | Engenharia de Computação | Experiência técnica em SAP Business One (HANA)',
  $$Comecei em 2021 como estagiário de ERP, trabalhando direto com dados e suporte a usuários em ambientes SAP Business One. Desde então passei por suporte técnico, desenvolvimento de banco de dados, integrações críticas e iniciativas de automação que reduziram em até 90% as falhas operacionais recorrentes.

Ao longo dos anos me especializei em construir serviços resilientes e integrações robustas com C# e .NET, com foco em reduzir risco operacional e aumentar a confiabilidade de sistemas corporativos.

Minha motivação é simples: transformar processos frágeis em sistemas previsíveis e escaláveis.

Fora do código, gosto de pedalar, ler, escrever e treinar. São disciplinas que reforçam persistência, pensamento estruturado e melhoria contínua — valores que levo para a engenharia de software.$$,
  now(), false
);

-- 4. Projetos (case studies)
INSERT INTO "Projects" (
  "Title", "Category", "Description", "Tags", "GitHubUrl", "Metric1Name", "Metric1Value",
  "Metric2Name", "Metric2Value", "Icon", "DisplayOrder", "IsActive", "IsDeleted", "CreatedAt",
  "BusinessProblem", "TechnicalSolution", "TechnicalDecisions", "TradeOffs", "ArchitectureNotes"
) VALUES
(
  'Gerenciador Automático do Ciclo de Pedidos de Venda',
  'Automação de Processos',
  $$Serviço de automação baseado em regras que identifica e cancela pedidos de venda parados há mais de 48h, conforme critérios definidos pelo negócio. Automatizou todo o fluxo de validação, reduzindo a revisão manual e acelerando o giro da fila de pedidos.$$,
  '.NET,HANA,Automação',
  NULL,
  'Redução do backlog', '-60%',
  'Tempo de revisão manual', '-50%',
  'refresh-cw', 0, true, false, now(),
  $$Pedidos de venda parados se acumulavam no SAP B1 por atraso na revisão manual, travando alocação de estoque e atrasando entregas a clientes. A checagem manual era lenta e sujeita a erro.$$,
  $$[
    {"step": "Identificar pedidos sem movimentação há mais de 48h com queries HANA otimizadas e filtros de data indexados", "tool": "SQL HANA com joins otimizados"},
    {"step": "Validar os pedidos contra critérios configuráveis do negócio (status de pagamento, disponibilidade de estoque, limite de crédito)", "tool": "Motor de regras em .NET com pipeline de validação extensível"},
    {"step": "Cancelar ou sinalizar os pedidos automaticamente conforme o resultado das regras", "tool": "Automação .NET integrada ao SDK do SAP B1"},
    {"step": "Avisar os times de vendas e estoque via Webex com os detalhes do pedido e o motivo do cancelamento", "tool": "API do Webex com mensagens padronizadas"},
    {"step": "Registrar todas as ações com trilha de auditoria completa (data/hora, contexto e resultado das regras)", "tool": "Log estruturado em SQL Server"}
  ]$$,
  $$[
    {"decision": "SQL HANA para checagem em massa em vez de LINQ no .NET", "reason": "O armazenamento colunar em memória do HANA consulta bases grandes (100 mil+ pedidos) em menos de um segundo. Acesso direto via SQL evita o overhead do ORM e aproveita a otimização nativa do HANA."},
    {"decision": "Motor de regras em .NET em vez de validações fixas no código", "reason": "O negócio consegue mudar os critérios de cancelamento sem novo deploy. O pipeline extensível suporta avaliações com várias condições e separa acesso a dados de regra de negócio."},
    {"decision": "Processamento assíncrono em background em vez de chamadas síncronas", "reason": "Não bloqueia a operação dos usuários, permite rodar lotes fora do horário de pico e habilita retentativas para falhas transitórias."},
    {"decision": "Alertas no Webex em vez de e-mail", "reason": "Mensagem em tempo real garante visibilidade imediata para a operação, com confirmação de entrega e notificação no celular."}
  ]$$,
  $$[
    {"decision": "Cancelamento automático reduz a supervisão manual", "tradeoff": "Exige alta confiança nas regras. Mitigado com testes, rollout gradual, relatório de exceções, log de auditoria e opção de intervenção manual."},
    {"decision": "Alertas em tempo real podem gerar ruído", "tradeoff": "Resolvido com agrupamento de alertas, filtro por severidade, limites configuráveis e horário de silêncio."},
    {"decision": "Queries HANA dão performance, mas reduzem portabilidade", "tradeoff": "Aceitável porque o SAP B1 já depende do HANA. As queries ficam atrás de um repositório para limitar o impacto de uma troca de banco."},
    {"decision": "Motor de regras adiciona complexidade", "tradeoff": "O custo inicial se paga em manutenção e agilidade: regras mudam sem ciclo completo de deploy."}
  ]$$,
  'Pedidos SAP B1 → SQL HANA → Motor de regras .NET → Cancelamento automático → Log → Alertas Webex'
),
(
  'Motor de Resiliência do Processamento de Margem',
  'Confiabilidade de ERP',
  $$Serviço em background desenvolvido em .NET que monitora, reprocessa e alerta falhas nos jobs de cálculo de margem do SAP Business One. Reduziu as falhas recorrentes que afetavam o fechamento financeiro e deu visibilidade à operação com alertas no Webex.$$,
  '.NET,HANA,BackgroundService,Webhooks',
  'https://github.com/heliofilho2/alimentaMargem',
  'Redução de falhas', '-90%',
  'Tempo de recuperação manual', '-85%',
  'activity', 1, true, false, now(),
  $$Falhas recorrentes nos jobs de cálculo de margem do SAP B1 atrasavam o fechamento financeiro, exigiam muita intervenção manual e comprometiam a precisão das decisões. O tratamento de erro e o monitoramento existentes eram insuficientes.$$,
  $$[
    {"step": "Monitorar continuamente todos os jobs de cálculo de margem", "tool": ".NET BackgroundService"},
    {"step": "Reprocessar automaticamente os jobs com falha, com intervalos configuráveis", "tool": "Lógica de retry em .NET"},
    {"step": "Avisar o time financeiro quando uma falha persistir", "tool": "Alertas Webex"}
  ]$$,
  $$[
    {"decision": "Usar .NET BackgroundService", "reason": "Confiável, leve e roda continuamente sem intervenção do usuário."},
    {"decision": "Alertas no Webex em vez de e-mail", "reason": "Visibilidade imediata para o time financeiro."}
  ]$$,
  $$[
    {"decision": "Retentativas automáticas podem aumentar a carga do sistema", "tradeoff": "Exige agendamento cuidadoso para evitar horários de pico."},
    {"decision": "Alertas imediatos podem sobrecarregar o time se forem frequentes demais", "tradeoff": "Mitigado com controle de frequência dos alertas."}
  ]$$,
  'Jobs de margem SAP B1 → Serviço .NET em background → Motor de retry → Log → Alertas Webex'
),
(
  'Serviço de Validação e Correção de Câmbio',
  'Automação Financeira',
  $$Serviço que valida e garante a consistência da cotação diária do câmbio em várias bases do SAP B1. Detecta falhas da automação legada, corrige os valores de moeda e envia alertas proativos no Webex para evitar divergências financeiras.$$,
  '.NET,HANA,Automação,Controle Financeiro',
  'https://github.com/heliofilho2/validadorDolar',
  'Ocorrência de falhas', '-90%',
  'Tempo de correção manual', '-80%',
  'dollar-sign', 2, true, false, now(),
  $$Cotações de câmbio inconsistentes entre várias instâncias do SAP B1 geravam divergências financeiras, muito retrabalho manual e atraso nos relatórios. A automação legada não era confiável e gerava risco operacional recorrente.$$,
  $$[
    {"step": "Buscar a cotação diária em uma fonte oficial", "tool": "Serviço .NET"},
    {"step": "Comparar com as bases do SAP B1 e encontrar divergências", "tool": "Queries SQL HANA"},
    {"step": "Corrigir automaticamente os valores inválidos", "tool": "Automação .NET"},
    {"step": "Enviar alertas proativos no Webex para qualquer anomalia", "tool": "API do Webex"}
  ]$$,
  $$[
    {"decision": "Usar .NET para automação entre várias bases", "reason": "Confiável, fácil de manter e integra bem com o SAP B1 em HANA."},
    {"decision": "SQL HANA para validar os dados direto na base", "reason": "Checagem em massa eficiente em grandes volumes de dados financeiros."},
    {"decision": "Alertas no Webex em vez de e-mail", "reason": "Notificação imediata para o time financeiro agir mais rápido."}
  ]$$,
  $$[
    {"decision": "Correção automática reduz a supervisão manual", "tradeoff": "Exige confiança nas regras; se a fonte da cotação vier errada, o erro se propaga."},
    {"decision": "Alertas no Webex criam dependência de um serviço externo", "tradeoff": "Uma queda do Webex atrasa os avisos, mas o monitoramento continua ativo."}
  ]$$,
  'Bases SAP B1 → Serviço de validação .NET → Checagem SQL HANA → Correção automática → Alertas Webex'
);

-- 5. Skills (Category: 1 Backend, 2 Sistemas Corporativos, 3 Dados & Performance, 4 Integração & Infra)
INSERT INTO "Skills" ("Name", "Category", "Proficiency", "DisplayOrder", "IsActive", "IsDeleted", "CreatedAt") VALUES
  ('C# / .NET',                                   1, 80, 0, true, false, now()),
  ('Web API / REST',                              1, 80, 1, true, false, now()),
  ('Background / Worker Services (.NET)',         1, 85, 2, true, false, now()),
  ('Agendamento e automação de jobs',             1, 80, 3, true, false, now()),
  ('Automação de regras de negócio',              1, 80, 4, true, false, now()),
  ('Tratamento de erros e resiliência',           1, 75, 5, true, false, now()),
  ('SAP Business One',                            2, 90, 0, true, false, now()),
  ('Service Layer',                               2, 85, 1, true, false, now()),
  ('DI API',                                      2, 88, 2, true, false, now()),
  ('Transaction Notification (validações SQL)',   2, 90, 3, true, false, now()),
  ('Pesquisas Formatadas (FMS)',                  2, 85, 4, true, false, now()),
  ('Automação pós-transação',                     2, 80, 5, true, false, now()),
  ('Suporte e troubleshooting de ERP em produção',2, 85, 6, true, false, now()),
  ('SQL / Otimização de queries',                 3, 85, 0, true, false, now()),
  ('SAP HANA',                                    3, 85, 1, true, false, now()),
  ('SQL Server',                                  3, 80, 2, true, false, now()),
  ('Stored Procedures / Triggers',                3, 85, 3, true, false, now()),
  ('Integrações RESTful',                         4, 85, 0, true, false, now()),
  ('Webhooks / Automação por eventos',            4, 80, 1, true, false, now()),
  ('Git / GitHub',                                4, 85, 2, true, false, now()),
  ('Supabase',                                    4, 70, 3, true, false, now());

-- 6. Experiências
INSERT INTO "Experiences" ("Title", "Company", "Description", "StartDate", "EndDate", "IsCurrent", "DisplayOrder", "IsActive", "IsDeleted", "CreatedAt") VALUES
  (
    'Desenvolvedor SAP Business One', 'SAASAgro',
    $$Desenvolvedor SAP Business One focado em integrações, desenvolvimento de add-ons e otimização de banco de dados (SAP HANA e SQL Server) com C# e .NET em ambientes de produção.$$,
    '2025-05-01T00:00:00Z', NULL, true, 0, true, false, now()
  ),
  (
    'Analista de Sistemas SAP Business One', 'PrimeInterway',
    $$Evoluí de estagiário a analista de sistemas, liderando iniciativas técnicas de SAP B1: desenvolvimento de banco de dados (HANA e SQL Server), desenvolvimento com SDK em C#, integrações e suporte em produção. Referência técnica de um time pequeno, atuando em otimização de sistema, migração de servidores e upgrades do SAP.$$,
    '2021-09-01T00:00:00Z', '2025-04-30T00:00:00Z', false, 1, true, false, now()
  ),
  (
    'Estagiário de Integração de Dados', 'Prefeitura de Itajubá',
    $$Desenvolvimento de scripts em Python para extração de dados via API e processamento de JSON, apoiando análises de dados públicos e iniciativas de automação.$$,
    '2021-01-01T00:00:00Z', '2021-08-31T00:00:00Z', false, 2, true, false, now()
  );

COMMIT;

-- Conferência rápida
SELECT 'Profiles' AS tabela, count(*) FROM "Profiles"
UNION ALL SELECT 'Projects', count(*) FROM "Projects"
UNION ALL SELECT 'Skills', count(*) FROM "Skills"
UNION ALL SELECT 'Experiences', count(*) FROM "Experiences";
