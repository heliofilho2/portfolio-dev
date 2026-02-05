namespace Portfolio.Domain.Entities;

/// <summary>
/// Entidade que representa uma habilidade técnica na matriz de skills.
/// 
/// DECISÕES DE DESIGN:
/// 1. Category como enum para type safety
/// 2. Proficiency como int (0-100) para facilitar cálculos
/// 3. Separamos por categoria para organização na UI
/// </summary>
public class Skill : BaseEntity
{
    /// <summary>
    /// Nome da habilidade (ex: "C# / .NET Core")
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Categoria da habilidade
    /// </summary>
    public SkillCategory Category { get; set; }

    /// <summary>
    /// Nível de proficiência (0-100)
    /// 
    /// POR QUÊ int e não enum?
    /// - Mais flexível (pode ter 95%, 88%, etc.)
    /// - Facilita cálculos e comparações
    /// - Trade-off: Precisa validar range (0-100)
    /// </summary>
    public int Proficiency { get; set; }

    /// <summary>
    /// Ordem de exibição dentro da categoria
    /// </summary>
    public int DisplayOrder { get; set; } = 0;

    /// <summary>
    /// Se a skill está ativa/visível
    /// </summary>
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Enum para categorias de habilidades.
/// 
/// POR QUÊ Enum?
/// - Type-safe (não pode ter typo)
/// - Fácil de usar em queries
/// - IntelliSense ajuda
/// 
/// Trade-off: Adicionar categoria requer deploy
/// Alternativa: Tabela Category separada (mais flexível, mais complexo)
/// </summary>
public enum SkillCategory
{
    BackendSystems = 1,
    ERPEcosystem = 2,
    DataPerformance = 3,
    IntegrationAndInfrastructure = 4
}
