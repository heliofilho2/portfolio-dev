using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Services;

namespace Portfolio.API.Controllers;

/// <summary>
/// Controller para gerenciar Experiences.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ExperiencesController : ControllerBase
{
    private readonly IExperienceService _service;

    public ExperiencesController(IExperienceService service)
    {
        _service = service ?? throw new ArgumentNullException(nameof(service));
    }

    /// <summary>
    /// Busca todas as experiências ordenadas por data (mais recente primeiro).
    /// GET /api/experiences
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ExperienceDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<ExperienceDto>>> GetExperiences()
    {
        try
        {
            var experiences = await _service.GetOrderedByDateAsync();
            return Ok(experiences);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca experiência atual (IsCurrent = true).
    /// GET /api/experiences/current
    /// </summary>
    [HttpGet("current")]
    [ProducesResponseType(typeof(ExperienceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExperienceDto>> GetCurrentExperience()
    {
        var experience = await _service.GetCurrentAsync();
        
        if (experience == null)
        {
            return NotFound(new { message = "No current experience found" });
        }

        return Ok(experience);
    }

    /// <summary>
    /// Busca experiência por ID.
    /// GET /api/experiences/{id}
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ExperienceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExperienceDto>> GetExperience(int id)
    {
        var experience = await _service.GetByIdAsync(id);
        
        if (experience == null)
        {
            return NotFound(new { message = $"Experience with id {id} not found" });
        }

        return Ok(experience);
    }

    /// <summary>
    /// Cria nova experiência.
    /// POST /api/experiences
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ExperienceDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ExperienceDto>> CreateExperience([FromBody] ExperienceCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var experience = await _service.CreateExperienceAsync(dto);
            return CreatedAtAction(
                nameof(GetExperience),
                new { id = experience.Id },
                experience);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza experiência existente.
    /// PUT /api/experiences/{id}
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ExperienceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ExperienceDto>> UpdateExperience(int id, [FromBody] ExperienceUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var experience = await _service.UpdateExperienceAsync(id, dto);
            
            if (experience == null)
            {
                return NotFound(new { message = $"Experience with id {id} not found" });
            }

            return Ok(experience);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deleta experiência (soft delete).
    /// DELETE /api/experiences/{id}
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteExperience(int id)
    {
        var deleted = await _service.DeleteExperienceAsync(id);
        
        if (!deleted)
        {
            return NotFound(new { message = $"Experience with id {id} not found" });
        }

        return NoContent();
    }
}
