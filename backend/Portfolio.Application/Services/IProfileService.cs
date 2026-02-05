using Portfolio.Application.DTOs;

namespace Portfolio.Application.Services;

/// <summary>
/// Interface do Service para Profile.
/// 
/// NOTA: Profile é singleton, então métodos são mais simples.
/// </summary>
public interface IProfileService
{
    /// <summary>
    /// Busca o perfil.
    /// Retorna null se não existir.
    /// </summary>
    Task<ProfileDto?> GetProfileAsync();

    /// <summary>
    /// Cria ou atualiza o perfil.
    /// Se já existir, atualiza. Se não, cria.
    /// </summary>
    Task<ProfileDto> UpsertProfileAsync(ProfileUpdateDto dto);
}
