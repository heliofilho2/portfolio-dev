namespace Portfolio.Domain.Entities;

/// <summary>
/// Entidade que representa um projeto/deployment no portfólio.
/// 
/// DECISÕES DE DESIGN:
/// 1. Separamos métricas em propriedades específicas (não JSON genérico)
///    - Facilita queries SQL
///    - Type-safe
///    - Melhor performance
/// 
/// 2. Tags como string separada por vírgula
///    - Simples de implementar
///    - Trade-off: Se precisar buscar por tag, melhor usar tabela separada (ProjectTag)
/// 
/// 3. Category como enum
///    - Type-safe
///    - Fácil de validar
///    - Trade-off: Adicionar nova categoria requer deploy
/// </summary>
public class Project : BaseEntity
{
    /// <summary>
    /// Título do projeto (ex: "Unified Commerce & SAP B1 Sync")
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Subtítulo/categoria técnica (ex: "Integration Engine")
    /// </summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Descrição detalhada do projeto
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Tags técnicas separadas por vírgula (ex: ".NET CORE,HANA,REDIS")
    /// 
    /// POR QUÊ string e não array?
    /// - PostgreSQL suporta arrays, mas EF Core tem limitações
    /// - String é mais simples para começar
    /// - Podemos migrar para tabela ProjectTag depois se necessário
    /// </summary>
    public string Tags { get; set; } = string.Empty;

    /// <summary>
    /// URL da imagem/thumbnail do projeto
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// URL do repositório GitHub (opcional)
    /// </summary>
    public string? GitHubUrl { get; set; }

    /// <summary>
    /// URL de demonstração/live (opcional)
    /// </summary>
    public string? DemoUrl { get; set; }

    // ========== MÉTRICAS DE IMPACTO ==========
    // Separamos métricas em propriedades específicas para:
    // - Type safety
    // - Facilita queries (ex: "projetos com efficiency > 50%")
    // - Melhor performance que JSON genérico

    /// <summary>
    /// Métrica 1: Nome (ex: "Process Time")
    /// </summary>
    public string? Metric1Name { get; set; }

    /// <summary>
    /// Métrica 1: Valor (ex: "-75%")
    /// </summary>
    public string? Metric1Value { get; set; }

    /// <summary>
    /// Métrica 2: Nome (ex: "Sync Accuracy")
    /// </summary>
    public string? Metric2Name { get; set; }

    /// <summary>
    /// Métrica 2: Valor (ex: "99.9%")
    /// </summary>
    public string? Metric2Value { get; set; }

    /// <summary>
    /// Ícone Material Symbols (ex: "hub", "monitoring", "terminal")
    /// </summary>
    public string? Icon { get; set; }

    /// <summary>
    /// Ordem de exibição (para controlar a ordem na UI)
    /// </summary>
    public int DisplayOrder { get; set; } = 0;

    /// <summary>
    /// Se o projeto está ativo/visível
    /// </summary>
    public bool IsActive { get; set; } = true;
}
