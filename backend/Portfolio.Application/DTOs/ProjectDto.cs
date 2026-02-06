namespace Portfolio.Application.DTOs;

/// <summary>
/// DTO para retornar Project na API (Response).
/// 
/// POR QUÊ DTO separado?
/// - Controla o que é exposto (não expõe IsDeleted, etc.)
/// - Facilita versionamento (ProjectDtoV2)
/// - Pode ter formato diferente da Entity
/// - Segurança: não expõe detalhes internos
/// </summary>
public class ProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? DemoUrl { get; set; }
    
    // Métricas
    public string? Metric1Name { get; set; }
    public string? Metric1Value { get; set; }
    public string? Metric2Name { get; set; }
    public string? Metric2Value { get; set; }
    
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    
    // Campos de Case Study
    public string? BusinessProblem { get; set; }
    public string? TechnicalSolution { get; set; } // JSON array como string
    public string? TechnicalDecisions { get; set; } // JSON array como string
    public string? TradeOffs { get; set; } // JSON array como string
    public string? ArchitectureNotes { get; set; }
    
    // Note: NÃO expomos IsDeleted, CreatedAt, UpdatedAt
    // Esses são detalhes internos que a API não precisa saber
}

/// <summary>
/// DTO para criar Project (Request).
/// 
/// POR QUÊ DTO separado para Create?
/// - Validação diferente (Title é obrigatório, Id não existe ainda)
/// - Pode ter campos diferentes (não precisa enviar CreatedAt)
/// - Facilita evolução (Create pode mudar sem afetar Response)
/// </summary>
public class ProjectCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? DemoUrl { get; set; }
    
    public string? Metric1Name { get; set; }
    public string? Metric1Value { get; set; }
    public string? Metric2Name { get; set; }
    public string? Metric2Value { get; set; }
    
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    
    // Campos de Case Study
    public string? BusinessProblem { get; set; }
    public string? TechnicalSolution { get; set; }
    public string? TechnicalDecisions { get; set; }
    public string? TradeOffs { get; set; }
    public string? ArchitectureNotes { get; set; }
    
    // Note: Id, CreatedAt, UpdatedAt, IsDeleted não estão aqui
    // Esses são gerados/gerenciados pelo sistema
}

/// <summary>
/// DTO para atualizar Project (Request).
/// 
/// POR QUÊ DTO separado para Update?
/// - Todos os campos são opcionais (partial update)
/// - Pode atualizar apenas alguns campos
/// - Diferente de Create (todos obrigatórios)
/// </summary>
public class ProjectUpdateDto
{
    public string? Title { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
    public string? Tags { get; set; }
    public string? ImageUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? DemoUrl { get; set; }
    
    public string? Metric1Name { get; set; }
    public string? Metric1Value { get; set; }
    public string? Metric2Name { get; set; }
    public string? Metric2Value { get; set; }
    
    public string? Icon { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsActive { get; set; }
    
    // Campos de Case Study
    public string? BusinessProblem { get; set; }
    public string? TechnicalSolution { get; set; }
    public string? TechnicalDecisions { get; set; }
    public string? TradeOffs { get; set; }
    public string? ArchitectureNotes { get; set; }
    
    // Note: Todos opcionais (nullable) para permitir partial update
}
