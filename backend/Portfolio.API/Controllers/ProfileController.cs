using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Services;

namespace Portfolio.API.Controllers;

/// <summary>
/// Controller para gerenciar Profile.
/// 
/// NOTA: Profile é singleton (apenas um registro).
/// Por isso endpoints são mais simples.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _service;

    public ProfileController(IProfileService service)
    {
        _service = service ?? throw new ArgumentNullException(nameof(service));
    }

    /// <summary>
    /// Busca o perfil.
    /// 
    /// GET /api/profile
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        try
        {
            var profile = await _service.GetProfileAsync();
            
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            // Debug: verificar se AboutText está presente
            System.Diagnostics.Debug.WriteLine($"Profile AboutText: {profile.AboutText ?? "NULL"}");
            
            return Ok(profile);
        }
        catch (Exception ex)
        {
            // Log do erro (em produção, usar ILogger)
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Cria ou atualiza o perfil.
    /// 
    /// PUT /api/profile
    /// 
    /// NOTA: Se já existir, atualiza. Se não, cria.
    /// </summary>
    [HttpPut]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProfileDto>> UpsertProfile([FromBody] ProfileUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var profile = await _service.UpsertProfileAsync(dto);
            return Ok(profile);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
