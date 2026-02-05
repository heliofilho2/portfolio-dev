using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces;

/// <summary>
/// Interface do Repository para Skills.
/// 
/// Similar a IProjectRepository, mas específico para Skills.
/// 
/// POR QUÊ interface separada?
/// - Single Responsibility: cada repository uma responsabilidade
/// - Facilita testes (mock só o que precisa)
/// - Segue Interface Segregation Principle (SOLID)
/// </summary>
public interface ISkillRepository
{
    Task<Skill?> GetByIdAsync(int id);

    /// <summary>
    /// Busca skills por categoria.
    /// 
    /// POR QUÊ método específico?
    /// - UI agrupa skills por categoria
    /// - Encapsula lógica de filtro
    /// - Facilita queries otimizadas
    /// </summary>
    Task<List<Skill>> GetByCategoryAsync(SkillCategory category);

    /// <summary>
    /// Busca todas as skills ativas, ordenadas por categoria e display order.
    /// 
    /// POR QUÊ ordenar no repository?
    /// - Lógica de ordenação é parte do acesso a dados
    /// - Pode usar índices do banco (mais eficiente)
    /// - Controller não precisa ordenar
    /// </summary>
    Task<List<Skill>> GetActiveSkillsOrderedAsync();

    Task<List<Skill>> GetAllAsync();
    Task AddAsync(Skill skill);
    Task UpdateAsync(Skill skill);
    Task DeleteAsync(int id);
    Task<int> SaveChangesAsync();
}
