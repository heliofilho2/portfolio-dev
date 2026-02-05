namespace Portfolio.Application.DTOs;

/// <summary>
/// DTO para retornar Profile na API (Response).
/// </summary>
public class ProfileDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Languages { get; set; }
    public string? Description { get; set; }
    public string? AvatarUrl { get; set; }
    public string? ExperienceYears { get; set; }
    public string? CoreEngine { get; set; }
    public string? Database { get; set; }
    public string? Email { get; set; }
    public string? GitHubUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? Specialized { get; set; }
    public string? Certifications { get; set; }
    public string? AboutText { get; set; }
}

/// <summary>
/// DTO para criar/atualizar Profile (Request).
/// </summary>
public class ProfileUpdateDto
{
    public string? Name { get; set; }
    public string? Role { get; set; }
    public string? Location { get; set; }
    public string? Languages { get; set; }
    public string? Description { get; set; }
    public string? AvatarUrl { get; set; }
    public string? ExperienceYears { get; set; }
    public string? CoreEngine { get; set; }
    public string? Database { get; set; }
    public string? Email { get; set; }
    public string? GitHubUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? Specialized { get; set; }
    public string? Certifications { get; set; }
    public string? AboutText { get; set; }
}
