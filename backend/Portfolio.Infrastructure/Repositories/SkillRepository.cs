using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

/// <summary>
/// Implementação do ISkillRepository usando EF Core.
/// </summary>
public class SkillRepository : ISkillRepository
{
    private readonly PortfolioDbContext _context;

    public SkillRepository(PortfolioDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Skill?> GetByIdAsync(int id)
    {
        return await _context.Skills
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<Skill>> GetByCategoryAsync(SkillCategory category)
    {
        // Usa índice composto (Category, DisplayOrder)
        return await _context.Skills
            .Where(s => s.Category == category && s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();
    }

    public async Task<List<Skill>> GetActiveSkillsOrderedAsync()
    {
        // Ordena por categoria e depois por display order
        // Facilita agrupar na UI
        return await _context.Skills
            .Where(s => s.IsActive)
            .OrderBy(s => s.Category)
            .ThenBy(s => s.DisplayOrder)
            .ToListAsync();
    }

    public async Task<List<Skill>> GetAllAsync()
    {
        return await _context.Skills
            .OrderBy(s => s.Category)
            .ThenBy(s => s.DisplayOrder)
            .ToListAsync();
    }

    public async Task AddAsync(Skill skill)
    {
        await _context.Skills.AddAsync(skill);
    }

    public async Task UpdateAsync(Skill skill)
    {
        _context.Skills.Update(skill);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(int id)
    {
        var skill = await GetByIdAsync(id);
        if (skill != null)
        {
            skill.IsDeleted = true;
            skill.UpdatedAt = DateTime.UtcNow;
        }
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
