# Passo 4: Repository Pattern Implementado - O que fizemos?

## ✅ O que criamos

### 1. Interfaces em Application (3 interfaces)
- `IProjectRepository` - Contrato para acesso a Projects
- `ISkillRepository` - Contrato para acesso a Skills  
- `IExperienceRepository` - Contrato para acesso a Experiences

**POR QUÊ em Application?**
- Application define contratos (interfaces)
- Infrastructure implementa contratos
- API usa contratos (não conhece implementação)

### 2. Implementações em Infrastructure (3 repositories)
- `ProjectRepository` - Implementa `IProjectRepository` usando EF Core
- `SkillRepository` - Implementa `ISkillRepository` usando EF Core
- `ExperienceRepository` - Implementa `IExperienceRepository` usando EF Core

**POR QUÊ em Infrastructure?**
- Infrastructure contém implementações técnicas
- Conhece EF Core (DbContext)
- Application não conhece Infrastructure

### 3. Registro no DI Container
- Repositories registrados como Scoped
- Mesmo ciclo de vida do DbContext
- DI Container resolve automaticamente

## 🎯 Conceitos Aplicados

### 1. Dependency Inversion Principle (SOLID)
```
Controller → IProjectRepository (abstração)
                ↑
                │ implementa
                │
        ProjectRepository (implementação)
```

**Controller depende de abstração, não de implementação!**

### 2. Repository Pattern
- Encapsula acesso a dados
- Abstrai detalhes de EF Core
- Facilita testes e manutenção

### 3. Dependency Injection
- DI Container gerencia criação de objetos
- Resolve dependências automaticamente
- Facilita testes (pode mockar)

## 📊 Fluxo de Dependências

```
HTTP Request
    ↓
Controller (pede IProjectRepository)
    ↓
DI Container (fornece ProjectRepository)
    ↓
ProjectRepository (usa PortfolioDbContext)
    ↓
PortfolioDbContext (conecta em PostgreSQL)
    ↓
Supabase (retorna dados)
```

## 🔍 Métodos Criados

### IProjectRepository
- `GetByIdAsync(int id)` - Busca por ID
- `GetActiveProjectsAsync()` - Busca projetos ativos
- `GetAllAsync()` - Busca todos
- `AddAsync(Project)` - Adiciona novo
- `UpdateAsync(Project)` - Atualiza existente
- `DeleteAsync(int id)` - Soft delete
- `SaveChangesAsync()` - Salva mudanças

### ISkillRepository
- `GetByIdAsync(int id)`
- `GetByCategoryAsync(SkillCategory)` - Busca por categoria
- `GetActiveSkillsOrderedAsync()` - Busca ativas ordenadas
- `GetAllAsync()`
- `AddAsync(Skill)`
- `UpdateAsync(Skill)`
- `DeleteAsync(int id)`
- `SaveChangesAsync()`

### IExperienceRepository
- `GetByIdAsync(int id)`
- `GetOrderedByDateAsync()` - Busca ordenadas por data
- `GetCurrentAsync()` - Busca experiência atual
- `GetAllAsync()`
- `AddAsync(Experience)`
- `UpdateAsync(Experience)`
- `DeleteAsync(int id)`
- `SaveChangesAsync()`

## 🧪 Como Testar?

### Teste Unitário (Mock)
```csharp
var mockRepository = new Mock<IProjectRepository>();
mockRepository.Setup(r => r.GetActiveProjectsAsync())
    .ReturnsAsync(new List<Project> { ... });

var controller = new ProjectsController(mockRepository.Object);
// Testa sem banco!
```

### Teste de Integração (Banco Real)
```csharp
// Usa DbContext real (InMemory ou Supabase de teste)
var context = new PortfolioDbContext(options);
var repository = new ProjectRepository(context);
// Testa com banco real
```

## ⚠️ Decisões de Design

### 1. Métodos Específicos vs Genéricos

**✅ Fizemos: Métodos específicos**
```csharp
GetActiveProjectsAsync() // Específico
```

**❌ Alternativa: Método genérico**
```csharp
GetAllAsync(Expression<Func<Project, bool>> filter) // Genérico
```

**POR QUÊ específicos?**
- Mais simples de usar
- Encapsula lógica de filtro
- Facilita otimizações (usa índices)
- Trade-off: Mais métodos, mas mais claro

### 2. SaveChangesAsync Separado

**✅ Fizemos: Método separado**
```csharp
repository.AddAsync(project);
repository.AddAsync(project2);
await repository.SaveChangesAsync(); // Salva ambos
```

**❌ Alternativa: Salvar automaticamente**
```csharp
await repository.AddAsync(project); // Salva automaticamente
```

**POR QUÊ separado?**
- Unit of Work pattern
- Pode fazer várias operações e salvar uma vez
- Melhor performance (menos round-trips)
- Permite transações

### 3. Soft Delete no Repository

**✅ Fizemos: Soft delete no repository**
```csharp
public async Task DeleteAsync(int id)
{
    var project = await GetByIdAsync(id);
    project.IsDeleted = true;
    project.UpdatedAt = DateTime.UtcNow;
}
```

**POR QUÊ?**
- Encapsula lógica de soft delete
- Controller não precisa saber como deletar
- Consistente (sempre atualiza UpdatedAt)

## ❓ Perguntas para você

1. **Por que Repository é Scoped e não Singleton?**
   - Resposta: Repository depende de DbContext que é Scoped. Se fosse Singleton, compartilharia DbContext entre requisições, causando problemas de concorrência.

2. **Por que não colocar lógica de negócio no Repository?**
   - Resposta: Repository é apenas acesso a dados. Lógica de negócio vai em Services (Application layer). Separação de responsabilidades (SRP).

3. **Por que métodos async?**
   - Resposta: Operações de I/O (banco) são assíncronas. Async não bloqueia thread, melhor performance, padrão moderno em .NET.

## 🚀 Próximo Passo

Agora vamos criar:
1. **DTOs (Data Transfer Objects)** - Objetos para transferir dados entre camadas
2. **Services** - Lógica de negócio e orquestração
3. **Mappings** - Converter entre Entity e DTO

**POR QUÊ DTOs?**
- Não expor entidades diretamente (segurança)
- Controlar o que é retornado
- Validação de entrada
- Versionamento de API
