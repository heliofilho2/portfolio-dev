using Portfolio.Domain.Entities;

namespace Portfolio.Application.DTOs;

/// <summary>
/// DTO para retornar Skill na API (Response).
/// </summary>
public class SkillDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public SkillCategory Category { get; set; }
    public int Proficiency { get; set; }
    public int DisplayOrder { get; set; }
}

/// <summary>
/// DTO para criar Skill (Request).
/// </summary>
public class SkillCreateDto
{
    public string Name { get; set; } = string.Empty;
    public SkillCategory Category { get; set; }
    public int Proficiency { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// DTO para atualizar Skill (Request).
/// </summary>
public class SkillUpdateDto
{
    public string? Name { get; set; }
    public SkillCategory? Category { get; set; }
    public int? Proficiency { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsActive { get; set; }
}
