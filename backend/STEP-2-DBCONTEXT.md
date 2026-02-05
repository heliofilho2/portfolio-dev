# Passo 2: DbContext e Configuração - O que fizemos?

## ✅ O que criamos

### 1. PortfolioDbContext

**O QUE É DbContext?**
- É a "ponte" entre suas entidades C# e o banco de dados
- Gerencia conexões, queries, transações
- Converte LINQ em SQL automaticamente

**POR QUÊ no Infrastructure?**
- DbContext é uma implementação técnica (EF Core)
- Domain não deve conhecer EF Core
- Segue Clean Architecture: detalhes técnicos em Infrastructure

### 2. DbSet<T>

```csharp
public DbSet<Project> Projects { get; set; }
```

**O QUE É?**
- Representa uma tabela no banco
- Permite fazer queries type-safe
- Nome da propriedade = Nome da tabela (por padrão)

**EXEMPLO DE USO:**
```csharp
// Buscar todos os projetos ativos
var projects = await _context.Projects
    .Where(p => p.IsActive)
    .OrderBy(p => p.DisplayOrder)
    .ToListAsync();
```

### 3. OnModelCreating - Fluent API

**POR QUÊ Fluent API?**
- Mais controle que Data Annotations
- Código de configuração centralizado
- Domain fica limpo (sem atributos [Required], etc.)

**O QUE CONFIGURAMOS:**

#### a) Índices
```csharp
entity.HasIndex(p => p.IsActive);
```

**POR QUÊ?**
- Acelera queries que filtram por IsActive
- Trade-off: Desacelera INSERT/UPDATE (precisa atualizar índice)
- Regra: Índice em colunas usadas em WHERE/ORDER BY

#### b) HasMaxLength
```csharp
entity.Property(p => p.Title).HasMaxLength(200);
```

**POR QUÊ?**
- Evita dados gigantes no banco
- Performance: strings menores = queries mais rápidas
- Validação: Banco rejeita se exceder

#### c) HasQueryFilter (Soft Delete)
```csharp
entity.HasQueryFilter(p => !p.IsDeleted);
```

**POR QUÊ?**
- Filtra automaticamente registros deletados
- Evita esquecer de filtrar manualmente
- Todas as queries automaticamente excluem IsDeleted == true

**EXEMPLO:**
```csharp
// Isso automaticamente adiciona WHERE IsDeleted = false
var projects = await _context.Projects.ToListAsync();
```

#### d) HasDefaultValue
```csharp
entity.Property(p => p.IsActive).HasDefaultValue(true);
```

**POR QUÊ?**
- Se não especificar valor, usa padrão
- Facilita inserts (não precisa especificar tudo)

## 🔐 Connection String - Segurança

### ❌ ERRADO (Nunca faça isso!)
```csharp
// NUNCA hardcode connection string!
var connectionString = "Host=db.xxx.supabase.co;Password=minhasenha123";
```

**POR QUÊ?**
- Senha no código = commit no Git = vazamento
- Diferentes ambientes (dev/prod) precisam de strings diferentes
- Não é flexível

### ✅ CORRETO (Variáveis de Ambiente)
```csharp
// Lê de variável de ambiente
var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
```

**POR QUÊ?**
- Senha não vai para o Git
- Cada ambiente tem sua própria variável
- Seguro e flexível

## 📝 Próximo Passo: Configurar no Program.cs

Vamos:
1. Ler connection string de variável de ambiente
2. Registrar DbContext no DI Container
3. Configurar para usar PostgreSQL (Supabase)

**POR QUÊ DI Container?**
- Gerencia ciclo de vida dos objetos
- Facilita testes (pode mockar)
- Segue SOLID (Dependency Inversion)
