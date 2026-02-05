# Passo 5: DTOs e Services - O que fizemos?

## ✅ O que criamos

### 1. DTOs (Data Transfer Objects)

**9 DTOs criados:**

#### Projects:
- `ProjectDto` - Response (retorna dados)
- `ProjectCreateDto` - Request (cria novo)
- `ProjectUpdateDto` - Request (atualiza existente)

#### Skills:
- `SkillDto` - Response
- `SkillCreateDto` - Request
- `SkillUpdateDto` - Request

#### Experiences:
- `ExperienceDto` - Response
- `ExperienceCreateDto` - Request
- `ExperienceUpdateDto` - Request

**POR QUÊ DTOs separados para Create/Update?**
- Create: Todos os campos obrigatórios
- Update: Todos os campos opcionais (partial update)
- Facilita evolução independente

### 2. Services (3 Services)

- `ProjectService` - Lógica de negócio para Projects
- `SkillService` - Lógica de negócio para Skills
- `ExperienceService` - Lógica de negócio para Experiences

**Cada Service tem:**
- Interface (IProjectService, etc.)
- Implementação (ProjectService, etc.)
- Validações de negócio
- Conversão Entity ↔ DTO
- Orquestração de Repositories

### 3. Registro no DI Container

- Services registrados como Scoped
- Mesmo ciclo de vida dos Repositories

## 🎯 Conceitos Aplicados

### 1. Separation of Concerns

```
Controller (HTTP)
    ↓
Service (Lógica de Negócio)
    ↓
Repository (Acesso a Dados)
    ↓
Database
```

**Cada camada uma responsabilidade!**

### 2. DTO Pattern

**POR QUÊ não expor Entity diretamente?**
- Segurança: Não expõe IsDeleted, CreatedAt, etc.
- Controle: Decide exatamente o que retornar
- Versionamento: Pode criar ProjectDtoV2
- Validação: DTOs podem ter validações diferentes

### 3. Service Layer Pattern

**POR QUÊ Service?**
- Encapsula lógica de negócio
- Reutilizável (pode ser usado por diferentes Controllers)
- Testável (fácil mockar Repository)
- Centraliza validações

## 📋 Validações Implementadas

### ProjectService
- Title obrigatório
- Title mínimo 3 caracteres

### SkillService
- Name obrigatório
- Proficiency entre 0-100

### ExperienceService
- Title obrigatório
- EndDate >= StartDate
- Se IsCurrent = true, EndDate deve ser null

**POR QUÊ validação no Service?**
- Lógica de negócio pertence ao Service
- Pode ser reutilizada
- Facilita testes

## 🔄 Fluxo Completo

```
1. HTTP Request (JSON)
   ↓
2. Controller recebe DTO (ProjectCreateDto)
   ↓
3. Controller chama Service (IProjectService.CreateProjectAsync)
   ↓
4. Service valida (Title >= 3 caracteres)
   ↓
5. Service converte DTO → Entity
   ↓
6. Service chama Repository (IProjectRepository.AddAsync)
   ↓
7. Repository salva no banco (via DbContext)
   ↓
8. Service converte Entity → DTO (ProjectDto)
   ↓
9. Controller retorna DTO
   ↓
10. HTTP Response (JSON)
```

## ⚠️ Decisões de Design

### 1. Partial Update (UpdateDto com campos opcionais)

**✅ Fizemos: Campos opcionais**
```csharp
public class ProjectUpdateDto
{
    public string? Title { get; set; } // Opcional
}
```

**POR QUÊ?**
- Frontend pode enviar apenas campos que mudaram
- Mais eficiente (menos dados na rede)
- Mais flexível

**❌ Alternativa: Campos obrigatórios**
```csharp
public class ProjectUpdateDto
{
    public string Title { get; set; } // Sempre obrigatório
}
```

**Trade-off:** Menos flexível, mas mais simples

### 2. Mappings Manuais

**✅ Fizemos: Métodos MapToDto() manuais**

**POR QUÊ?**
- Simples de entender
- Controle total
- Sem dependências externas

**❌ Alternativa: AutoMapper**
```csharp
var dto = _mapper.Map<ProjectDto>(project);
```

**Trade-off:** Mais código manual vs dependência externa

**FUTURO:** Pode migrar para AutoMapper se mappings ficarem complexos

### 3. Validação no Service

**✅ Fizemos: Validação no Service**

**POR QUÊ?**
- Lógica de negócio pertence ao Service
- Reutilizável
- Testável

**❌ Alternativa: Validação no Controller**
- Lógica espalhada
- Difícil reutilizar
- Viola SRP

## ❓ Perguntas para você

1. **Por que UpdateDto tem campos opcionais e CreateDto tem obrigatórios?**
   - Resposta: Create precisa de todos os dados para criar. Update permite atualizar apenas alguns campos (partial update).

2. **Por que validação no Service e não no Controller?**
   - Resposta: Lógica de negócio pertence ao Service. Controller apenas orquestra HTTP. Service pode ser reutilizado.

3. **Por que não usar AutoMapper desde o início?**
   - Resposta: Começamos simples. Se mappings ficarem complexos, migramos. YAGNI (You Aren't Gonna Need It).

## 🚀 Próximo Passo

Agora vamos criar os **Controllers** que:
1. Recebem HTTP Requests
2. Chamam Services
3. Retornam HTTP Responses
4. Documentam API com Swagger

**POR QUÊ Controllers agora?**
- Temos toda a base pronta (Repositories, Services, DTOs)
- Controllers são finos (apenas orquestram)
- Podemos testar a API completa
