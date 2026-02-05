# Arquitetura do Backend - Explicação Detalhada

## 🔗 Dependências entre Projetos

```
Portfolio.API
    ├── Portfolio.Application  ✅
    └── Portfolio.Infrastructure ✅

Portfolio.Application
    └── Portfolio.Domain ✅

Portfolio.Infrastructure
    ├── Portfolio.Domain ✅
    └── Portfolio.Application ✅

Portfolio.Domain
    └── (NENHUMA DEPENDÊNCIA) ✅
```

## ⚠️ REGRA CRÍTICA: Direção das Dependências

**Domain NUNCA pode depender de nada!**

Por quê?
- Domain contém a lógica de negócio pura
- Se Domain depender de Infrastructure, não podemos testar sem banco de dados
- Se Domain depender de Application, criamos dependência circular
- Domain deve ser testável isoladamente

**Application depende APENAS de Domain**

Por quê?
- Application contém casos de uso (use cases)
- Precisa das entidades de Domain
- NÃO precisa saber como os dados são persistidos

**Infrastructure depende de Domain E Application**

Por quê?
- Infrastructure implementa interfaces definidas em Application
- Usa entidades de Domain
- É onde EF Core, Repositories, etc. vivem

**API depende de Application E Infrastructure**

Por quê?
- API precisa registrar serviços (DI) que estão em Infrastructure
- API usa interfaces de Application
- API NÃO conhece Domain diretamente (só via Application)

## 🎯 Princípio SOLID Aplicado

### Single Responsibility Principle (SRP)
- Cada projeto tem UMA responsabilidade
- Domain = Entidades
- Application = Lógica de negócio
- Infrastructure = Acesso a dados
- API = Interface HTTP

### Dependency Inversion Principle (DIP)
- Application define INTERFACES (contratos)
- Infrastructure IMPLEMENTA essas interfaces
- API depende de abstrações (interfaces), não de implementações

Exemplo:
```csharp
// Application define o contrato
public interface IProjectRepository
{
    Task<Project> GetByIdAsync(int id);
}

// Infrastructure implementa
public class ProjectRepository : IProjectRepository
{
    // Implementação com EF Core
}

// API usa a interface (não conhece a implementação)
public class ProjectsController
{
    private readonly IProjectRepository _repository; // Depende de abstração!
}
```

## 🧪 Testabilidade

Com essa arquitetura:
- ✅ Podemos testar Domain sem banco de dados
- ✅ Podemos mockar repositories em testes
- ✅ Podemos testar Application isoladamente
- ✅ Podemos trocar PostgreSQL por MongoDB sem mudar Domain/Application

## 📦 Próximos Passos

1. Criar entidades em Domain
2. Criar interfaces em Application
3. Implementar repositories em Infrastructure
4. Criar DTOs em Application
5. Criar services em Application
6. Criar controllers em API
