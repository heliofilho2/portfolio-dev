# DTOs e Services - Explicação Completa

## 🎯 O que são DTOs?

**DTO = Data Transfer Object**

Objetos simples usados para transferir dados entre camadas (API ↔ Application ↔ Infrastructure).

## 📊 Entity vs DTO

### Entity (Domain)
```csharp
public class Project : BaseEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; } // ⚠️ Não deve ser exposto!
    // ... muitas outras propriedades
}
```

**PROBLEMAS de expor Entity diretamente:**
- Expõe propriedades internas (IsDeleted, CreatedAt, etc.)
- Não controla o que é retornado
- Dificulta versionamento de API
- Mistura modelo de domínio com contrato de API

### DTO (Application)
```csharp
public class ProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Category { get; set; }
    // Apenas o que a API precisa!
}
```

**VANTAGENS:**
- Controla exatamente o que é exposto
- Não expõe detalhes internos
- Facilita versionamento (ProjectDtoV2)
- Validação de entrada

## 🔄 Fluxo de Dados

```
HTTP Request
    ↓
Controller recebe ProjectCreateDto (Request)
    ↓
Service converte DTO → Entity
    ↓
Repository salva Entity no banco
    ↓
Service converte Entity → ProjectDto (Response)
    ↓
Controller retorna ProjectDto
    ↓
JSON Response
```

## 🏗️ Services - Lógica de Negócio

**Service é onde vive a lógica de negócio!**

### ❌ ERRADO: Lógica no Controller
```csharp
public class ProjectsController
{
    public async Task<IActionResult> Create(ProjectCreateDto dto)
    {
        // ❌ Lógica de negócio no Controller!
        if (dto.Title.Length < 3)
            return BadRequest();
        
        var project = new Project { Title = dto.Title };
        await _repository.AddAsync(project);
        await _repository.SaveChangesAsync();
        return Ok(project);
    }
}
```

**PROBLEMAS:**
- Controller fica gordo
- Difícil testar lógica isoladamente
- Lógica espalhada
- Viola Single Responsibility

### ✅ CORRETO: Lógica no Service
```csharp
public class ProjectService
{
    public async Task<ProjectDto> CreateProjectAsync(ProjectCreateDto dto)
    {
        // ✅ Lógica de negócio no Service!
        if (dto.Title.Length < 3)
            throw new ValidationException("Title must be at least 3 characters");
        
        var project = new Project { Title = dto.Title };
        await _repository.AddAsync(project);
        await _repository.SaveChangesAsync();
        
        return MapToDto(project);
    }
}

public class ProjectsController
{
    public async Task<IActionResult> Create(ProjectCreateDto dto)
    {
        // ✅ Controller apenas orquestra!
        var result = await _service.CreateProjectAsync(dto);
        return Ok(result);
    }
}
```

**VANTAGENS:**
- Lógica centralizada
- Fácil testar
- Controller magro
- Reutilizável

## 📝 Estrutura que vamos criar

```
Portfolio.Application/
  ├── DTOs/
  │   ├── ProjectDto.cs (Response)
  │   ├── ProjectCreateDto.cs (Request)
  │   ├── SkillDto.cs
  │   └── ExperienceDto.cs
  │
  └── Services/
      ├── IProjectService.cs (Interface)
      ├── ProjectService.cs (Implementação)
      ├── ISkillService.cs
      ├── SkillService.cs
      ├── IExperienceService.cs
      └── ExperienceService.cs
```

## 🎯 Princípios Aplicados

### 1. Separation of Concerns
- Controller: HTTP (recebe request, retorna response)
- Service: Lógica de negócio
- Repository: Acesso a dados

### 2. Single Responsibility Principle
- Cada classe uma responsabilidade
- Service: Apenas lógica de negócio
- Controller: Apenas HTTP

### 3. Dependency Inversion
- Controller depende de Service (interface)
- Service depende de Repository (interface)

## ⚠️ Trade-offs

### ✅ Vantagens
- Separação clara de responsabilidades
- Fácil testar
- Reutilizável
- Versionamento de API

### ❌ Desvantagens
- Mais código (DTOs + Mappings)
- Pode ser "over-engineering" para APIs simples
- Curva de aprendizado

**DECISÃO:** Vale a pena porque:
- Demonstra conhecimento de arquitetura
- Facilita manutenção
- Escalável

## 🚀 Próximo Passo

Vamos criar:
1. DTOs (Request e Response)
2. Services (lógica de negócio)
3. Mappings (converter Entity ↔ DTO)
