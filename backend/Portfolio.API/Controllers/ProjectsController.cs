using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Services;

namespace Portfolio.API.Controllers;

/// <summary>
/// Controller para gerenciar Projects.
/// 
/// POR QUÊ Controller?
/// - Responsável APENAS por HTTP (recebe request, retorna response)
/// - NÃO contém lógica de negócio (isso fica no Service)
/// - NÃO conhece banco de dados (isso fica no Repository)
/// 
/// RESPONSABILIDADES:
/// - Receber HTTP Requests
/// - Validar formato (ModelState)
/// - Chamar Service
/// - Retornar HTTP Responses
/// - Tratar erros HTTP
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _service;

    /// <summary>
    /// Construtor recebe Service via Dependency Injection.
    /// 
    /// POR QUÊ via DI?
    /// - DI Container gerencia criação
    /// - Facilita testes (pode mockar)
    /// - Segue Dependency Inversion Principle
    /// </summary>
    public ProjectsController(IProjectService service)
    {
        _service = service ?? throw new ArgumentNullException(nameof(service));
    }

    /// <summary>
    /// Busca todos os projetos ativos.
    /// 
    /// GET /api/projects
    /// 
    /// POR QUÊ método específico em vez de GetAll?
    /// - API pública geralmente mostra apenas ativos
    /// - Encapsula lógica de filtro
    /// - Pode ter GetAll() separado para admin
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ProjectDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<ProjectDto>>> GetActiveProjects()
    {
        try
        {
            var projects = await _service.GetActiveProjectsAsync();
            return Ok(projects);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca projeto por ID.
    /// 
    /// GET /api/projects/{id}
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectDto>> GetProject(int id)
    {
        var project = await _service.GetByIdAsync(id);
        
        if (project == null)
        {
            return NotFound(new { message = $"Project with id {id} not found" });
        }

        return Ok(project);
    }

    /// <summary>
    /// Cria novo projeto.
    /// 
    /// POST /api/projects
    /// 
    /// POR QUÊ [FromBody]?
    /// - Indica que dados vêm no body da requisição (JSON)
    /// - ASP.NET Core faz binding automático
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] ProjectCreateDto dto)
    {
        // Validação de modelo (formato)
        // POR QUÊ aqui?
        // - Validação de formato (required, max length, etc.) é responsabilidade do Controller
        // - Validação de negócio (Title >= 3 caracteres) fica no Service
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var project = await _service.CreateProjectAsync(dto);
            
            // 201 Created com Location header
            // POR QUÊ 201?
            // - Indica que recurso foi criado
            // - Location header indica onde encontrar o recurso
            // - Padrão REST
            return CreatedAtAction(
                nameof(GetProject),
                new { id = project.Id },
                project);
        }
        catch (ArgumentException ex)
        {
            // Validação de negócio falhou
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza projeto existente.
    /// 
    /// PUT /api/projects/{id}
    /// 
    /// POR QUÊ PUT e não PATCH?
    /// - PUT: Atualização completa (substitui recurso)
    /// - PATCH: Atualização parcial (modifica apenas alguns campos)
    /// - Usamos PUT com DTO parcial (UpdateDto tem campos opcionais)
    /// - Trade-off: PATCH seria mais semântico, mas PUT é mais comum
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProjectDto>> UpdateProject(int id, [FromBody] ProjectUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var project = await _service.UpdateProjectAsync(id, dto);
            
            if (project == null)
            {
                return NotFound(new { message = $"Project with id {id} not found" });
            }

            return Ok(project);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deleta projeto (soft delete).
    /// 
    /// DELETE /api/projects/{id}
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var deleted = await _service.DeleteProjectAsync(id);
        
        if (!deleted)
        {
            return NotFound(new { message = $"Project with id {id} not found" });
        }

        // 204 No Content
        // POR QUÊ 204?
        // - Indica sucesso sem conteúdo para retornar
        // - Padrão REST para DELETE
        return NoContent();
    }
}
