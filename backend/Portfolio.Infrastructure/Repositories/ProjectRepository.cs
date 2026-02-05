using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

/// <summary>
/// Implementação do IProjectRepository usando EF Core.
/// 
/// POR QUÊ em Infrastructure?
/// - Infrastructure contém implementações técnicas
/// - Conhece EF Core (DbContext)
/// - Application não conhece Infrastructure
/// 
/// PATTERN: Repository Pattern
/// - Encapsula acesso a dados
/// - Abstrai detalhes de EF Core
/// - Facilita testes e manutenção
/// </summary>
public class ProjectRepository : IProjectRepository
{
    private readonly PortfolioDbContext _context;

    /// <summary>
    /// Construtor recebe DbContext via Dependency Injection.
    /// 
    /// POR QUÊ via DI?
    /// - DbContext é gerenciado pelo framework
    /// - Ciclo de vida controlado (Scoped = uma instância por requisição)
    /// - Facilita testes (pode injetar mock)
    /// </summary>
    public ProjectRepository(PortfolioDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Project?> GetByIdAsync(int id)
    {
        // Query otimizada: busca apenas o necessário
        // HasQueryFilter automaticamente adiciona !IsDeleted
        return await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Project>> GetActiveProjectsAsync()
    {
        // Query usa índices criados (IsActive, DisplayOrder)
        // Ordena por DisplayOrder para controlar ordem na UI
        return await _context.Projects
            .Where(p => p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();
    }

    public async Task<List<Project>> GetAllAsync()
    {
        // Busca todos (incluindo inativos)
        // Útil para admin/dashboard
        return await _context.Projects
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();
    }

    public async Task AddAsync(Project project)
    {
        // Adiciona ao contexto (não salva ainda)
        // SaveChangesAsync() salva no banco
        await _context.Projects.AddAsync(project);
    }

    public async Task UpdateAsync(Project project)
    {
        // EF Core tracking detecta mudanças automaticamente
        // Se projeto veio do banco, EF Core sabe que existe
        // Se é novo, use AddAsync()
        _context.Projects.Update(project);
        await Task.CompletedTask; // Método async para manter contrato
    }

    public async Task DeleteAsync(int id)
    {
        // Soft delete: marca como deletado
        var project = await GetByIdAsync(id);
        if (project != null)
        {
            project.IsDeleted = true;
            project.UpdatedAt = DateTime.UtcNow;
            // Não precisa chamar UpdateAsync, EF Core tracking detecta mudança
        }
    }

    public async Task<int> SaveChangesAsync()
    {
        // Salva todas as mudanças pendentes no banco
        // Retorna número de linhas afetadas
        // 
        // POR QUÊ int?
        // - Útil para saber quantas linhas foram afetadas
        // - Pode ser usado para validação/logging
        return await _context.SaveChangesAsync();
    }
}
