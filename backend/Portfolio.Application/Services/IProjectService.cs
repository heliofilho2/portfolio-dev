using Portfolio.Application.DTOs;

namespace Portfolio.Application.Services;

/// <summary>
/// Interface do Service para Projects.
/// 
/// POR QUÊ Service?
/// - Encapsula lógica de negócio
/// - Orquestra repositories
/// - Converte Entity ↔ DTO
/// - Valida regras de negócio
/// 
/// POR QUÊ Interface?
/// - Facilita testes (mock)
/// - Permite diferentes implementações
/// - Segue Dependency Inversion Principle
/// </summary>
public interface IProjectService
{
    /// <summary>
    /// Busca projeto por ID.
    /// Retorna null se não encontrado.
    /// </summary>
    Task<ProjectDto?> GetByIdAsync(int id);

    /// <summary>
    /// Busca todos os projetos ativos.
    /// </summary>
    Task<List<ProjectDto>> GetActiveProjectsAsync();

    /// <summary>
    /// Busca todos os projetos (incluindo inativos).
    /// </summary>
    Task<List<ProjectDto>> GetAllAsync();

    /// <summary>
    /// Cria novo projeto.
    /// 
    /// POR QUÊ retornar DTO?
    /// - Retorna dados formatados para API
    /// - Inclui Id gerado pelo banco
    /// - Pode incluir dados calculados
    /// </summary>
    Task<ProjectDto> CreateProjectAsync(ProjectCreateDto dto);

    /// <summary>
    /// Atualiza projeto existente.
    /// 
    /// POR QUÊ partial update?
    /// - Permite atualizar apenas alguns campos
    /// - Mais flexível para frontend
    /// - Evita enviar dados desnecessários
    /// </summary>
    Task<ProjectDto?> UpdateProjectAsync(int id, ProjectUpdateDto dto);

    /// <summary>
    /// Deleta projeto (soft delete).
    /// </summary>
    Task<bool> DeleteProjectAsync(int id);
}
