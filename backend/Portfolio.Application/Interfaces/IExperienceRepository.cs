using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces;

/// <summary>
/// Interface do Repository para Experiences.
/// </summary>
public interface IExperienceRepository
{
    Task<Experience?> GetByIdAsync(int id);

    /// <summary>
    /// Busca todas as experiências, ordenadas por data (mais recente primeiro).
    /// 
    /// POR QUÊ ordenar por data?
    /// - Timeline mostra mais recente primeiro
    /// - Lógica de ordenação no repository (usa índice)
    /// </summary>
    Task<List<Experience>> GetOrderedByDateAsync();

    /// <summary>
    /// Busca experiência atual (IsCurrent = true).
    /// 
    /// POR QUÊ método específico?
    /// - UI destaca posição atual
    /// - Query otimizada (usa índice em IsCurrent)
    /// </summary>
    Task<Experience?> GetCurrentAsync();

    Task<List<Experience>> GetAllAsync();
    Task AddAsync(Experience experience);
    Task UpdateAsync(Experience experience);
    Task DeleteAsync(int id);
    Task<int> SaveChangesAsync();
}
