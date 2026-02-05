using Portfolio.Application.DTOs;

namespace Portfolio.Application.Services;

public interface IExperienceService
{
    Task<ExperienceDto?> GetByIdAsync(int id);
    Task<List<ExperienceDto>> GetOrderedByDateAsync();
    Task<ExperienceDto?> GetCurrentAsync();
    Task<List<ExperienceDto>> GetAllAsync();
    Task<ExperienceDto> CreateExperienceAsync(ExperienceCreateDto dto);
    Task<ExperienceDto?> UpdateExperienceAsync(int id, ExperienceUpdateDto dto);
    Task<bool> DeleteExperienceAsync(int id);
}
