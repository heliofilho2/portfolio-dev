using Portfolio.Application.DTOs;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public interface ISkillService
{
    Task<SkillDto?> GetByIdAsync(int id);
    Task<List<SkillDto>> GetByCategoryAsync(SkillCategory category);
    Task<List<SkillDto>> GetActiveSkillsAsync();
    Task<List<SkillDto>> GetAllAsync();
    Task<SkillDto> CreateSkillAsync(SkillCreateDto dto);
    Task<SkillDto?> UpdateSkillAsync(int id, SkillUpdateDto dto);
    Task<bool> DeleteSkillAsync(int id);
}
