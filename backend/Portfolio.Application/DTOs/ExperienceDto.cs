namespace Portfolio.Application.DTOs;

/// <summary>
/// DTO para retornar Experience na API (Response).
/// </summary>
public class ExperienceDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public int DisplayOrder { get; set; }
}

/// <summary>
/// DTO para criar Experience (Request).
/// </summary>
public class ExperienceCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// DTO para atualizar Experience (Request).
/// </summary>
public class ExperienceUpdateDto
{
    public string? Title { get; set; }
    public string? Company { get; set; }
    public string? Description { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool? IsCurrent { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsActive { get; set; }
}
