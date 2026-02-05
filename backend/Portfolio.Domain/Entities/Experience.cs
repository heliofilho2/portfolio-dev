namespace Portfolio.Domain.Entities;

/// <summary>
/// Entidade que representa uma experiência profissional.
/// 
/// DECISÕES DE DESIGN:
/// 1. StartDate e EndDate como DateTime?
///    - EndDate nullable = ainda trabalhando (Present)
///    - Facilita cálculos de duração
/// 
/// 2. Description como string simples
///    - Trade-off: Se precisar de rich text, usar Markdown ou HTML
/// </summary>
public class Experience : BaseEntity
{
    /// <summary>
    /// Título do cargo (ex: "Lead SAP B1 Developer")
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Nome da empresa (opcional)
    /// </summary>
    public string? Company { get; set; }

    /// <summary>
    /// Descrição das responsabilidades e conquistas
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Data de início
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Data de término (null = Present)
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Se é a posição atual (usa para destacar na UI)
    /// </summary>
    public bool IsCurrent { get; set; }

    /// <summary>
    /// Ordem de exibição (mais recente primeiro)
    /// </summary>
    public int DisplayOrder { get; set; } = 0;

    /// <summary>
    /// Se está ativo/visível
    /// </summary>
    public bool IsActive { get; set; } = true;
}
