# O que são Migrations?

## 🎯 Conceito

**Migrations são como "Git para banco de dados"**

- Versionam mudanças no schema
- Permitem rollback
- Documentam evolução do banco
- Facilitam deploy em diferentes ambientes

## 📝 Como Funciona?

### 1. Você muda as entidades (C#)
```csharp
public class Project : BaseEntity
{
    public string Title { get; set; }  // Adiciona nova propriedade
}
```

### 2. Cria uma Migration
```bash
dotnet ef migrations add AddTitleToProject
```

### 3. EF Core gera SQL
```sql
ALTER TABLE "Projects" ADD COLUMN "Title" TEXT;
```

### 4. Aplica no banco
```bash
dotnet ef database update
```

## 🔄 Fluxo Completo

```
Entidades C# (Domain)
    ↓
DbContext (Infrastructure)
    ↓
Migration (SQL gerado)
    ↓
Banco de Dados (Supabase)
```

## 📦 Estrutura de uma Migration

```csharp
public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // SQL para aplicar a migration
        migrationBuilder.CreateTable(...);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // SQL para reverter a migration (rollback)
        migrationBuilder.DropTable(...);
    }
}
```

**POR QUÊ Up/Down?**
- `Up`: Aplica a mudança (cria tabela, adiciona coluna, etc.)
- `Down`: Reverte a mudança (rollback)
- Permite voltar atrás se algo der errado

## ✅ Vantagens

1. **Versionamento**: Cada migration tem timestamp
2. **Rollback**: Pode desfazer mudanças
3. **Colaboração**: Time todo usa o mesmo schema
4. **Deploy**: Aplica migrations automaticamente
5. **Histórico**: Vê evolução do banco ao longo do tempo

## ⚠️ Boas Práticas

### ✅ FAZER:
- Uma migration por mudança lógica
- Nomes descritivos: `AddEmailToUser`, `CreateProjectsTable`
- Testar migrations em dev antes de produção
- Fazer backup antes de aplicar em produção

### ❌ NÃO FAZER:
- Editar migrations já aplicadas (crie nova)
- Deletar migrations aplicadas (quebra histórico)
- Commitar migrations com dados sensíveis

## 🚀 Próximo Passo

Vamos criar a primeira migration (InitialCreate) que cria todas as tabelas!
