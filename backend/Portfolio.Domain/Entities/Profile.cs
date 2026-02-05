namespace Portfolio.Domain.Entities;

/// <summary>
/// Entidade que representa o perfil pessoal do portfólio.
/// 
/// DECISÕES DE DESIGN:
/// 1. Uma única entidade Profile (não múltiplas)
///    - Assumimos que há apenas um perfil (singleton)
///    - Se precisar de múltiplos perfis no futuro, criar ProfileId
/// 
/// 2. Campos opcionais para flexibilidade
///    - Nem todos os campos são obrigatórios
///    - Permite atualização parcial
/// </summary>
public class Profile : BaseEntity
{
    /// <summary>
    /// Nome completo
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Cargo/título profissional (ex: "System Architect")
    /// </summary>
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Localização (ex: "ITAJUBÁ, MG")
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    /// Idiomas (ex: "PT/EN")
    /// </summary>
    public string? Languages { get; set; }

    /// <summary>
    /// Descrição/bio profissional
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// URL da foto de perfil
    /// </summary>
    public string? AvatarUrl { get; set; }

    /// <summary>
    /// Anos de experiência (formato livre, ex: "4.2 Years")
    /// </summary>
    public string? ExperienceYears { get; set; }

    /// <summary>
    /// Core Engine/Stack principal (ex: "C# / .NET / SAP B1")
    /// </summary>
    public string? CoreEngine { get; set; }

    /// <summary>
    /// Database/tecnologias de banco (ex: "HANA / SQL Server")
    /// </summary>
    public string? Database { get; set; }

    /// <summary>
    /// Email de contato
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// URL do GitHub
    /// </summary>
    public string? GitHubUrl { get; set; }

    /// <summary>
    /// URL do LinkedIn
    /// </summary>
    public string? LinkedInUrl { get; set; }

    /// <summary>
    /// Especialização (ex: "ERP/FinTech")
    /// </summary>
    public string? Specialized { get; set; }

    /// <summary>
    /// Certificações (ex: "SAP B1 Certified SDK")
    /// </summary>
    public string? Certifications { get; set; }

    /// <summary>
    /// Texto pessoal/humano sobre hobbies, interesses, etc. (para página About)
    /// </summary>
    public string? AboutText { get; set; }
}
