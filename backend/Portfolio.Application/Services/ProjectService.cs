using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

/// <summary>
/// Implementação do IProjectService.
/// 
/// POR QUÊ Service?
/// - Contém lógica de negócio
/// - Orquestra repositories
/// - Converte Entity ↔ DTO
/// - Valida regras de negócio
/// 
/// POR QUÊ em Application?
/// - Application contém lógica de aplicação
/// - Não conhece detalhes de HTTP (Controller)
/// - Não conhece detalhes de banco (Repository)
/// </summary>
public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repository;

    public ProjectService(IProjectRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<ProjectDto?> GetByIdAsync(int id)
    {
        var project = await _repository.GetByIdAsync(id);
        return project == null ? null : MapToDto(project);
    }

    public async Task<List<ProjectDto>> GetActiveProjectsAsync()
    {
        var projects = await _repository.GetActiveProjectsAsync();
        return projects.Select(MapToDto).ToList();
    }

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        var projects = await _repository.GetAllAsync();
        return projects.Select(MapToDto).ToList();
    }

    public async Task<ProjectDto> CreateProjectAsync(ProjectCreateDto dto)
    {
        // VALIDAÇÃO DE NEGÓCIO
        // POR QUÊ aqui e não no Controller?
        // - Lógica de negócio pertence ao Service
        // - Pode ser reutilizada (ex: usado por outro Controller)
        // - Facilita testes
        
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ArgumentException("Title is required", nameof(dto));
        }

        if (dto.Title.Length < 3)
        {
            throw new ArgumentException("Title must be at least 3 characters", nameof(dto));
        }

        // CONVERTE DTO → Entity
        var project = new Project
        {
            Title = dto.Title,
            Category = dto.Category,
            Description = dto.Description,
            Tags = dto.Tags,
            ImageUrl = dto.ImageUrl,
            GitHubUrl = dto.GitHubUrl,
            DemoUrl = dto.DemoUrl,
            Metric1Name = dto.Metric1Name,
            Metric1Value = dto.Metric1Value,
            Metric2Name = dto.Metric2Name,
            Metric2Value = dto.Metric2Value,
            Icon = dto.Icon,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            // Campos de Case Study
            BusinessProblem = dto.BusinessProblem,
            TechnicalSolution = dto.TechnicalSolution,
            TechnicalDecisions = dto.TechnicalDecisions,
            TradeOffs = dto.TradeOffs,
            ArchitectureNotes = dto.ArchitectureNotes,
            // CreatedAt é preenchido automaticamente por BaseEntity
        };

        // SALVA NO BANCO
        await _repository.AddAsync(project);
        await _repository.SaveChangesAsync();

        // RETORNA DTO
        return MapToDto(project);
    }

    public async Task<ProjectDto?> UpdateProjectAsync(int id, ProjectUpdateDto dto)
    {
        // BUSCA PROJETO
        var project = await _repository.GetByIdAsync(id);
        if (project == null)
        {
            return null; // Não encontrado
        }

        // VALIDAÇÃO
        if (dto.Title != null && dto.Title.Length < 3)
        {
            throw new ArgumentException("Title must be at least 3 characters", nameof(dto));
        }

        // PARTIAL UPDATE: Atualiza apenas campos fornecidos
        // POR QUÊ partial?
        // - Frontend pode enviar apenas campos que mudaram
        // - Mais eficiente (menos dados na rede)
        // - Mais flexível
        
        if (dto.Title != null) project.Title = dto.Title;
        if (dto.Category != null) project.Category = dto.Category;
        if (dto.Description != null) project.Description = dto.Description;
        if (dto.Tags != null) project.Tags = dto.Tags;
        if (dto.ImageUrl != null) project.ImageUrl = dto.ImageUrl;
        if (dto.GitHubUrl != null) project.GitHubUrl = dto.GitHubUrl;
        if (dto.DemoUrl != null) project.DemoUrl = dto.DemoUrl;
        if (dto.Metric1Name != null) project.Metric1Name = dto.Metric1Name;
        if (dto.Metric1Value != null) project.Metric1Value = dto.Metric1Value;
        if (dto.Metric2Name != null) project.Metric2Name = dto.Metric2Name;
        if (dto.Metric2Value != null) project.Metric2Value = dto.Metric2Value;
        if (dto.Icon != null) project.Icon = dto.Icon;
        if (dto.DisplayOrder.HasValue) project.DisplayOrder = dto.DisplayOrder.Value;
        if (dto.IsActive.HasValue) project.IsActive = dto.IsActive.Value;
        
        // Campos de Case Study
        if (dto.BusinessProblem != null) project.BusinessProblem = dto.BusinessProblem;
        if (dto.TechnicalSolution != null) project.TechnicalSolution = dto.TechnicalSolution;
        if (dto.TechnicalDecisions != null) project.TechnicalDecisions = dto.TechnicalDecisions;
        if (dto.TradeOffs != null) project.TradeOffs = dto.TradeOffs;
        if (dto.ArchitectureNotes != null) project.ArchitectureNotes = dto.ArchitectureNotes;

        // Atualiza UpdatedAt
        project.UpdatedAt = DateTime.UtcNow;

        // SALVA
        await _repository.UpdateAsync(project);
        await _repository.SaveChangesAsync();

        return MapToDto(project);
    }

    public async Task<bool> DeleteProjectAsync(int id)
    {
        var project = await _repository.GetByIdAsync(id);
        if (project == null)
        {
            return false; // Não encontrado
        }

        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Converte Entity → DTO.
    /// 
    /// POR QUÊ método privado?
    /// - Encapsula lógica de conversão
    /// - Pode evoluir sem afetar outros métodos
    /// - Facilita manutenção
    /// 
    /// FUTURO: Pode usar AutoMapper para automatizar
    /// </summary>
    private static ProjectDto MapToDto(Project project)
    {
        return new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Category = project.Category,
            Description = project.Description,
            Tags = project.Tags,
            ImageUrl = project.ImageUrl,
            GitHubUrl = project.GitHubUrl,
            DemoUrl = project.DemoUrl,
            Metric1Name = project.Metric1Name,
            Metric1Value = project.Metric1Value,
            Metric2Name = project.Metric2Name,
            Metric2Value = project.Metric2Value,
            Icon = project.Icon,
            DisplayOrder = project.DisplayOrder,
            // Campos de Case Study
            BusinessProblem = project.BusinessProblem,
            TechnicalSolution = project.TechnicalSolution,
            TechnicalDecisions = project.TechnicalDecisions,
            TradeOffs = project.TradeOffs,
            ArchitectureNotes = project.ArchitectureNotes,
        };
    }
}
