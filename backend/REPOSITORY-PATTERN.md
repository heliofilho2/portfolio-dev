# Repository Pattern - Explicação Completa

## 🎯 O que é Repository Pattern?

**Repository é uma camada de abstração sobre acesso a dados.**

Em vez de acessar o banco diretamente, você acessa através de uma interface.

## 📊 Comparação: COM vs SEM Repository

### ❌ SEM Repository (Direto no Controller)
```csharp
public class ProjectsController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    
    public ProjectsController(PortfolioDbContext context)
    {
        _context = context; // Depende diretamente de EF Core!
    }
    
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _context.Projects
            .Where(p => p.IsActive && !p.IsDeleted)
            .ToListAsync();
        return Ok(projects);
    }
}
```

**PROBLEMAS:**
- Controller conhece EF Core (viola Clean Architecture)
- Difícil testar (precisa de banco real)
- Lógica de acesso a dados espalhada
- Se trocar EF Core por Dapper, precisa mudar Controller

### ✅ COM Repository
```csharp
// Application define INTERFACE (contrato)
public interface IProjectRepository
{
    Task<List<Project>> GetActiveProjectsAsync();
}

// Infrastructure IMPLEMENTA
public class ProjectRepository : IProjectRepository
{
    private readonly PortfolioDbContext _context;
    
    public async Task<List<Project>> GetActiveProjectsAsync()
    {
        return await _context.Projects
            .Where(p => p.IsActive && !p.IsDeleted)
            .ToListAsync();
    }
}

// Controller usa INTERFACE (não conhece implementação)
public class ProjectsController : ControllerBase
{
    private readonly IProjectRepository _repository;
    
    public ProjectsController(IProjectRepository repository)
    {
        _repository = repository; // Depende de abstração!
    }
    
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _repository.GetActiveProjectsAsync();
        return Ok(projects);
    }
}
```

**VANTAGENS:**
- Controller não conhece EF Core
- Fácil testar (mock do repository)
- Lógica centralizada
- Pode trocar EF Core por Dapper sem mudar Controller

## 🏗️ Arquitetura

```
Controller (API)
    ↓ (depende de)
IProjectRepository (Application - Interface)
    ↓ (implementado por)
ProjectRepository (Infrastructure - Implementação)
    ↓ (usa)
PortfolioDbContext (Infrastructure - EF Core)
    ↓ (conecta em)
PostgreSQL (Supabase)
```

**REGRA DE DEPENDÊNCIA:**
- API depende de Application (interfaces)
- Infrastructure implementa Application (interfaces)
- Domain não depende de nada

## 🎯 Princípios SOLID Aplicados

### 1. Dependency Inversion Principle (DIP)
- Dependa de abstrações (interfaces), não de implementações
- Controller depende de `IProjectRepository`, não de `ProjectRepository`

### 2. Single Responsibility Principle (SRP)
- Repository: Responsável APENAS por acesso a dados
- Service: Responsável por lógica de negócio
- Controller: Responsável por HTTP

### 3. Open/Closed Principle (OCP)
- Pode criar novas implementações sem mudar código existente
- Ex: `ProjectRepository` (EF Core) ou `ProjectDapperRepository` (Dapper)

## 🧪 Testabilidade

### COM Repository (Fácil testar)
```csharp
// Teste unitário (sem banco!)
var mockRepository = new Mock<IProjectRepository>();
mockRepository.Setup(r => r.GetActiveProjectsAsync())
    .ReturnsAsync(new List<Project> { ... });

var controller = new ProjectsController(mockRepository.Object);
var result = await controller.GetProjects();
// Testa lógica sem banco!
```

### SEM Repository (Difícil testar)
```csharp
// Precisa de banco real ou InMemory (mais lento, mais complexo)
var options = new DbContextOptionsBuilder<PortfolioDbContext>()
    .UseInMemoryDatabase(databaseName: "TestDb")
    .Options;
// Mais código, mais lento, mais frágil
```

## 📝 Estrutura que vamos criar

```
Portfolio.Application/
  └── Interfaces/
      ├── IProjectRepository.cs      (contrato)
      ├── ISkillRepository.cs
      └── IExperienceRepository.cs

Portfolio.Infrastructure/
  └── Repositories/
      ├── ProjectRepository.cs       (implementação)
      ├── SkillRepository.cs
      └── ExperienceRepository.cs
```

## ⚠️ Trade-offs

### ✅ Vantagens
- Testabilidade
- Flexibilidade (trocar implementação)
- Separação de responsabilidades
- Clean Architecture

### ❌ Desvantagens
- Mais código (interfaces + implementações)
- Pode ser "over-engineering" para projetos simples
- Curva de aprendizado

**DECISÃO:** Para este projeto, vale a pena porque:
- É um portfólio técnico (precisa demonstrar boas práticas)
- Facilita testes
- Mostra conhecimento de arquitetura

## 🚀 Próximo Passo

Vamos criar:
1. Interfaces em Application
2. Implementações em Infrastructure
3. Registrar no DI Container
