# Passo 3: Migrations Criadas - O que fizemos?

## ✅ O que foi criado

### 1. Migration: InitialCreate

**Arquivo:** `Migrations/20260202234831_InitialCreate.cs`

**O QUE FAZ?**
- Cria as 3 tabelas: `Projects`, `Skills`, `Experiences`
- Cria todas as colunas baseadas nas entidades
- Cria índices para performance
- Define constraints (NOT NULL, defaults, etc.)

**TIMESTAMP no nome:**
- `20260202234831` = Data e hora da criação
- Garante ordem cronológica
- Evita conflitos em equipe

### 2. Designer File

**Arquivo:** `Migrations/20260202234831_InitialCreate.Designer.cs`

**O QUE É?**
- Metadados da migration
- EF Core usa para comparar estados
- Não edite manualmente!

### 3. Model Snapshot

**Arquivo:** `Migrations/PortfolioDbContextModelSnapshot.cs`

**O QUE É?**
- "Foto" do estado atual do banco
- EF Core compara com entidades para detectar mudanças
- Usado para gerar próxima migration

## 📋 O que a Migration faz?

### Tabela Projects
- Cria tabela com todas as colunas
- Índices em `IsActive` e `DisplayOrder`
- Query filter para soft delete
- Valores padrão (`IsActive = true`, `DisplayOrder = 0`)

### Tabela Skills
- Cria tabela com colunas
- Índice composto em `Category` + `DisplayOrder`
- Enum `Category` salvo como `int` no banco

### Tabela Experiences
- Cria tabela com colunas
- Índices em `StartDate` + `DisplayOrder` e `IsCurrent`

## 🔄 Métodos Up() e Down()

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    // Aplica a migration (cria tabelas)
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    // Reverte a migration (deleta tabelas)
}
```

**POR QUÊ Down()?**
- Permite rollback se algo der errado
- Útil em produção
- Testa se migration está correta

## 🚀 Próximos Passos

### Quando você criar o Supabase:

1. **Configure a connection string** (veja SUPABASE-SETUP.md)

2. **Aplique a migration:**
```bash
cd Portfolio.Infrastructure
dotnet ef database update --startup-project ../Portfolio.API/Portfolio.API.csproj
```

**O QUE FAZ?**
- Conecta no Supabase
- Executa o SQL da migration
- Cria todas as tabelas

3. **Verifique no Supabase:**
- Acesse Dashboard do Supabase
- Vá em Table Editor
- Deve ver as 3 tabelas criadas!

## ⚠️ Importante

### ✅ FAZER:
- Commitar migrations no Git
- Aplicar migrations em ordem
- Testar migrations em dev primeiro

### ❌ NÃO FAZER:
- Editar migrations já aplicadas
- Deletar migrations aplicadas
- Aplicar migrations sem backup em produção

## 📝 Comandos Úteis

```bash
# Criar nova migration
dotnet ef migrations add NomeDaMigration --startup-project ../Portfolio.API

# Aplicar migrations pendentes
dotnet ef database update --startup-project ../Portfolio.API

# Ver migrations pendentes
dotnet ef migrations list --startup-project ../Portfolio.API

# Reverter última migration
dotnet ef database update NomeDaMigrationAnterior --startup-project ../Portfolio.API

# Remover última migration (se não aplicada)
dotnet ef migrations remove --startup-project ../Portfolio.API
```

## 🎯 Conceitos Importantes

### 1. Migrations são Imutáveis
- Uma vez aplicada, não edite
- Crie nova migration para mudanças

### 2. Ordem Importa
- Migrations são aplicadas em ordem cronológica
- Timestamp garante ordem

### 3. Model Snapshot
- Representa estado atual do banco
- EF Core compara com entidades para detectar mudanças
- Se snapshot != entidades, precisa criar migration

## ❓ Perguntas para você

1. **Por que não criar tabelas manualmente no Supabase?**
   - Resposta: Migrations versionam mudanças, facilitam rollback, garantem que todos tenham o mesmo schema, e automatizam deploy.

2. **O que acontece se eu editar uma migration já aplicada?**
   - Resposta: Pode quebrar o histórico. Se já foi aplicada em produção, crie uma nova migration.

3. **Posso deletar migrations antigas?**
   - Resposta: Só se nunca foram aplicadas. Se já foram aplicadas, mantém para histórico.
