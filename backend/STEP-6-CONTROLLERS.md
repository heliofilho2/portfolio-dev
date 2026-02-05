# Passo 6: Controllers Implementados - O que fizemos?

## ✅ O que criamos

### 3 Controllers RESTful Completos

1. **ProjectsController** - `/api/projects`
2. **SkillsController** - `/api/skills`
3. **ExperiencesController** - `/api/experiences`

**Cada Controller tem:**
- GET (listar)
- GET {id} (buscar por ID)
- POST (criar)
- PUT {id} (atualizar)
- DELETE {id} (deletar)

## 🎯 Conceitos Aplicados

### 1. RESTful API Design

**VERBOS HTTP:**
- `GET` - Buscar dados (não modifica estado)
- `POST` - Criar novo recurso
- `PUT` - Atualizar recurso completo
- `DELETE` - Deletar recurso

**STATUS CODES:**
- `200 OK` - Sucesso (GET, PUT)
- `201 Created` - Recurso criado (POST)
- `204 No Content` - Sucesso sem conteúdo (DELETE)
- `400 Bad Request` - Erro de validação
- `404 Not Found` - Recurso não encontrado

**POR QUÊ esses status codes?**
- Padrão REST
- Facilita integração
- Cliente sabe o que aconteceu

### 2. Controller Responsibilities

**✅ Controller FAZ:**
- Recebe HTTP Requests
- Valida formato (ModelState)
- Chama Service
- Retorna HTTP Responses
- Trata erros HTTP

**❌ Controller NÃO FAZ:**
- Lógica de negócio (Service faz)
- Acesso a dados (Repository faz)
- Validação de negócio (Service faz)

### 3. Dependency Injection

```csharp
public ProjectsController(IProjectService service)
{
    _service = service; // DI injeta automaticamente
}
```

**POR QUÊ?**
- Facilita testes (mock)
- Baixo acoplamento
- Segue SOLID

## 📋 Endpoints Criados

### Projects
- `GET /api/projects` - Lista projetos ativos
- `GET /api/projects/{id}` - Busca por ID
- `POST /api/projects` - Cria novo
- `PUT /api/projects/{id}` - Atualiza
- `DELETE /api/projects/{id}` - Deleta

### Skills
- `GET /api/skills` - Lista skills ativas
- `GET /api/skills/category/{category}` - Por categoria
- `GET /api/skills/{id}` - Busca por ID
- `POST /api/skills` - Cria nova
- `PUT /api/skills/{id}` - Atualiza
- `DELETE /api/skills/{id}` - Deleta

### Experiences
- `GET /api/experiences` - Lista ordenadas por data
- `GET /api/experiences/current` - Busca atual
- `GET /api/experiences/{id}` - Busca por ID
- `POST /api/experiences` - Cria nova
- `PUT /api/experiences/{id}` - Atualiza
- `DELETE /api/experiences/{id}` - Deleta

## 🔍 Tratamento de Erros

### Validação de Formato (Controller)
```csharp
if (!ModelState.IsValid)
{
    return BadRequest(ModelState);
}
```

**POR QUÊ no Controller?**
- Validação de formato (required, max length) é HTTP
- Controller responsável por HTTP

### Validação de Negócio (Service)
```csharp
if (dto.Title.Length < 3)
{
    throw new ArgumentException("Title must be at least 3 characters");
}
```

**POR QUÊ no Service?**
- Lógica de negócio pertence ao Service
- Pode ser reutilizada

### Tratamento no Controller
```csharp
try
{
    var project = await _service.CreateProjectAsync(dto);
    return CreatedAtAction(...);
}
catch (ArgumentException ex)
{
    return BadRequest(new { message = ex.Message });
}
```

**POR QUÊ try/catch?**
- Converte exceções de negócio em HTTP responses
- Cliente recebe erro formatado

## 📚 Swagger/OpenAPI

**O QUE É?**
- Documentação automática da API
- Interface visual para testar endpoints
- Gera contrato OpenAPI (usado por frontend)

**POR QUÊ importante?**
- Facilita integração
- Documentação sempre atualizada
- Pode testar sem Postman

**ACESSO:**
- `http://localhost:5000/swagger` (quando rodar API)

## ⚠️ Decisões de Design

### 1. CreatedAtAction (201 Created)

```csharp
return CreatedAtAction(
    nameof(GetProject),
    new { id = project.Id },
    project);
```

**POR QUÊ?**
- Status 201 indica criação
- Location header indica onde encontrar recurso
- Padrão REST

### 2. NoContent() (204 No Content)

```csharp
return NoContent();
```

**POR QUÊ?**
- DELETE não retorna conteúdo
- Status 204 indica sucesso sem conteúdo
- Padrão REST

### 3. ModelState Validation

```csharp
if (!ModelState.IsValid)
{
    return BadRequest(ModelState);
}
```

**POR QUÊ?**
- Valida formato antes de chamar Service
- Retorna erros detalhados
- Evita chamadas desnecessárias

## ❓ Perguntas para você

1. **Por que Controller é tão "magro" (pouco código)?**
   - Resposta: Controller apenas orquestra HTTP. Lógica está no Service. Isso facilita testes e manutenção.

2. **Por que usar CreatedAtAction em vez de apenas Ok()?**
   - Resposta: Status 201 + Location header é padrão REST. Cliente sabe onde encontrar o recurso criado.

3. **Por que tratar ArgumentException no Controller?**
   - Resposta: Converte exceções de negócio (Service) em HTTP responses. Cliente recebe erro formatado.

## 🚀 Próximo Passo

Agora podemos:
1. **Testar a API** (rodar e testar no Swagger)
2. **Criar frontend** (Next.js consumindo API)
3. **Configurar Docker** (containerizar backend)

**O que você prefere fazer primeiro?**
