using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Services;
using Portfolio.Domain.Entities;

namespace Portfolio.API.Controllers;

/// <summary>
/// Controller para gerenciar Skills.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _service;

    public SkillsController(ISkillService service)
    {
        _service = service ?? throw new ArgumentNullException(nameof(service));
    }

    /// <summary>
    /// Busca todas as skills ativas.
    /// GET /api/skills
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<SkillDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<SkillDto>>> GetActiveSkills()
    {
        try
        {
            var skills = await _service.GetActiveSkillsAsync();
            return Ok(skills);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca skills por categoria.
    /// GET /api/skills/category/{category}
    /// </summary>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(List<SkillDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SkillDto>>> GetSkillsByCategory(SkillCategory category)
    {
        var skills = await _service.GetByCategoryAsync(category);
        return Ok(skills);
    }

    /// <summary>
    /// Busca skill por ID.
    /// GET /api/skills/{id}
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SkillDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SkillDto>> GetSkill(int id)
    {
        var skill = await _service.GetByIdAsync(id);
        
        if (skill == null)
        {
            return NotFound(new { message = $"Skill with id {id} not found" });
        }

        return Ok(skill);
    }

    /// <summary>
    /// Cria nova skill.
    /// POST /api/skills
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(SkillDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SkillDto>> CreateSkill([FromBody] SkillCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var skill = await _service.CreateSkillAsync(dto);
            return CreatedAtAction(
                nameof(GetSkill),
                new { id = skill.Id },
                skill);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza skill existente.
    /// PUT /api/skills/{id}
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(SkillDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SkillDto>> UpdateSkill(int id, [FromBody] SkillUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var skill = await _service.UpdateSkillAsync(id, dto);
            
            if (skill == null)
            {
                return NotFound(new { message = $"Skill with id {id} not found" });
            }

            return Ok(skill);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deleta skill (soft delete).
    /// DELETE /api/skills/{id}
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSkill(int id)
    {
        var deleted = await _service.DeleteSkillAsync(id);
        
        if (!deleted)
        {
            return NotFound(new { message = $"Skill with id {id} not found" });
        }

        return NoContent();
    }
}
