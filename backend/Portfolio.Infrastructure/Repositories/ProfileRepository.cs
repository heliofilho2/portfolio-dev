using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

/// <summary>
/// Implementação do IProfileRepository usando EF Core.
/// 
/// NOTA: Profile é singleton (apenas um registro).
/// Sempre busca o primeiro (e único) registro.
/// </summary>
public class ProfileRepository : IProfileRepository
{
    private readonly PortfolioDbContext _context;

    public ProfileRepository(PortfolioDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Profile?> GetProfileAsync()
    {
        // Busca o primeiro (e único) perfil
        // HasQueryFilter automaticamente adiciona !IsDeleted
        return await _context.Profiles
            .FirstOrDefaultAsync();
    }

    public async Task AddAsync(Profile profile)
    {
        await _context.Profiles.AddAsync(profile);
    }

    public async Task UpdateAsync(Profile profile)
    {
        _context.Profiles.Update(profile);
        await Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
