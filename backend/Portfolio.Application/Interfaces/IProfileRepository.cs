using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces;

/// <summary>
/// Interface do Repository para Profile.
/// 
/// NOTA: Profile é singleton (apenas um registro).
/// Por isso métodos são mais simples que outros repositories.
/// </summary>
public interface IProfileRepository
{
    /// <summary>
    /// Busca o perfil (deve haver apenas um).
    /// Retorna null se não existir.
    /// </summary>
    Task<Profile?> GetProfileAsync();

    /// <summary>
    /// Adiciona novo perfil.
    /// </summary>
    Task AddAsync(Profile profile);

    /// <summary>
    /// Atualiza perfil existente.
    /// </summary>
    Task UpdateAsync(Profile profile);

    /// <summary>
    /// Salva mudanças no banco.
    /// </summary>
    Task<int> SaveChangesAsync();
}
