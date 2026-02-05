using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

/// <summary>
/// Implementação do IExperienceRepository usando EF Core.
/// </summary>
public class ExperienceRepository : IExperienceRepository
{
    private readonly PortfolioDbContext _context;

    public ExperienceRepository(PortfolioDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Experience?> GetByIdAsync(int id)
    {
        return await _context.Experiences
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<List<Experience>> GetOrderedByDateAsync()
    {
        // Ordena por StartDate desc (mais recente primeiro)
        // Usa índice em StartDate + DisplayOrder
        return await _context.Experiences
            .Where(e => e.IsActive)
            .OrderByDescending(e => e.StartDate)
            .ThenBy(e => e.DisplayOrder)
            .ToListAsync();
    }

    public async Task<Experience?> GetCurrentAsync()
    {
        // Busca experiência atual (IsCurrent = true)
        // Usa índice em IsCurrent
        return await _context.Experiences
            .FirstOrDefaultAsync(e => e.IsCurrent && e.IsActive);
    }

    public async Task<List<Experience>> GetAllAsync()
    {
        return await _context.Experiences
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();
    }

    public async Task AddAsync(Experience experience)
    {
        await _context.Experiences.AddAsync(experience);
    }

    public async Task UpdateAsync(Experience experience)
    {
        _context.Experiences.Update(experience);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(int id)
    {
        var experience = await GetByIdAsync(id);
        if (experience != null)
        {
            experience.IsDeleted = true;
            experience.UpdatedAt = DateTime.UtcNow;
        }
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
