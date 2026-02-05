using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public class SkillService : ISkillService
{
    private readonly ISkillRepository _repository;

    public SkillService(ISkillRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<SkillDto?> GetByIdAsync(int id)
    {
        var skill = await _repository.GetByIdAsync(id);
        return skill == null ? null : MapToDto(skill);
    }

    public async Task<List<SkillDto>> GetByCategoryAsync(SkillCategory category)
    {
        var skills = await _repository.GetByCategoryAsync(category);
        return skills.Select(MapToDto).ToList();
    }

    public async Task<List<SkillDto>> GetActiveSkillsAsync()
    {
        var skills = await _repository.GetActiveSkillsOrderedAsync();
        return skills.Select(MapToDto).ToList();
    }

    public async Task<List<SkillDto>> GetAllAsync()
    {
        var skills = await _repository.GetAllAsync();
        return skills.Select(MapToDto).ToList();
    }

    public async Task<SkillDto> CreateSkillAsync(SkillCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Name is required", nameof(dto));
        }

        if (dto.Proficiency < 0 || dto.Proficiency > 100)
        {
            throw new ArgumentException("Proficiency must be between 0 and 100", nameof(dto));
        }

        var skill = new Skill
        {
            Name = dto.Name,
            Category = dto.Category,
            Proficiency = dto.Proficiency,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
        };

        await _repository.AddAsync(skill);
        await _repository.SaveChangesAsync();

        return MapToDto(skill);
    }

    public async Task<SkillDto?> UpdateSkillAsync(int id, SkillUpdateDto dto)
    {
        var skill = await _repository.GetByIdAsync(id);
        if (skill == null)
        {
            return null;
        }

        if (dto.Name != null && string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Name cannot be empty", nameof(dto));
        }

        if (dto.Proficiency.HasValue && (dto.Proficiency < 0 || dto.Proficiency > 100))
        {
            throw new ArgumentException("Proficiency must be between 0 and 100", nameof(dto));
        }

        if (dto.Name != null) skill.Name = dto.Name;
        if (dto.Category.HasValue) skill.Category = dto.Category.Value;
        if (dto.Proficiency.HasValue) skill.Proficiency = dto.Proficiency.Value;
        if (dto.DisplayOrder.HasValue) skill.DisplayOrder = dto.DisplayOrder.Value;
        if (dto.IsActive.HasValue) skill.IsActive = dto.IsActive.Value;

        skill.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(skill);
        await _repository.SaveChangesAsync();

        return MapToDto(skill);
    }

    public async Task<bool> DeleteSkillAsync(int id)
    {
        var skill = await _repository.GetByIdAsync(id);
        if (skill == null)
        {
            return false;
        }

        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static SkillDto MapToDto(Skill skill)
    {
        return new SkillDto
        {
            Id = skill.Id,
            Name = skill.Name,
            Category = skill.Category,
            Proficiency = skill.Proficiency,
            DisplayOrder = skill.DisplayOrder,
        };
    }
}
