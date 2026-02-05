# Por que Supabase?

## O que é Supabase?

Supabase é uma plataforma que oferece:
- **PostgreSQL gerenciado** (compatível 100% com PostgreSQL)
- **Auth** (autenticação pronta)
- **Storage** (armazenamento de arquivos)
- **Realtime** (subscriptions em tempo real)
- **Dashboard** (interface visual para gerenciar dados)

## Por que usar Supabase para este projeto?

### ✅ Vantagens

1. **PostgreSQL Real**
   - Não é um banco "customizado"
   - Usa o driver padrão Npgsql
   - Migrations funcionam normalmente
   - Pode migrar para PostgreSQL self-hosted depois

2. **Gratuito para começar**
   - 500MB de banco grátis
   - Perfeito para portfólio pessoal
   - Sem custos iniciais

3. **Dashboard Visual**
   - Ver dados sem precisar de cliente SQL
   - Fácil para você gerenciar
   - Bom para apresentar em entrevistas

4. **Backup Automático**
   - Não precisa se preocupar com backups
   - Restauração fácil

5. **Escalável**
   - Quando crescer, pode fazer upgrade
   - Ou migrar para Azure/AWS PostgreSQL

### ⚠️ Trade-offs

1. **Vendor Lock-in?**
   - NÃO! É PostgreSQL padrão
   - Pode exportar e migrar facilmente

2. **Limites no plano gratuito**
   - 500MB pode ser pouco para produção grande
   - Mas suficiente para portfólio

3. **Dependência de serviço externo**
   - Se Supabase cair, seu site cai
   - Mas uptime é muito alto (99.9%+)

## Como funciona a conexão?

```
Seu Backend (.NET)
    │
    │ Connection String
    │ (via Npgsql)
    │
    ▼
Supabase PostgreSQL
    │
    │ (mesmo protocolo que PostgreSQL normal)
    │
    ▼
Seus Dados
```

**IMPORTANTE:** Para o código, é como se fosse PostgreSQL normal. A única diferença é a connection string que aponta para o servidor do Supabase.

## Connection String do Supabase

Formato:
```
Host=db.xxxxx.supabase.co;
Port=5432;
Database=postgres;
Username=postgres;
Password=sua_senha;
SSL Mode=Require;
```

Vamos usar **variáveis de ambiente** para não commitar a senha no código!
