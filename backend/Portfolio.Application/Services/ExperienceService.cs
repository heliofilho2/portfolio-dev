using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public class ExperienceService : IExperienceService
{
    private readonly IExperienceRepository _repository;

    public ExperienceService(IExperienceRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<ExperienceDto?> GetByIdAsync(int id)
    {
        var experience = await _repository.GetByIdAsync(id);
        return experience == null ? null : MapToDto(experience);
    }

    public async Task<List<ExperienceDto>> GetOrderedByDateAsync()
    {
        var experiences = await _repository.GetOrderedByDateAsync();
        return experiences.Select(MapToDto).ToList();
    }

    public async Task<ExperienceDto?> GetCurrentAsync()
    {
        var experience = await _repository.GetCurrentAsync();
        return experience == null ? null : MapToDto(experience);
    }

    public async Task<List<ExperienceDto>> GetAllAsync()
    {
        var experiences = await _repository.GetAllAsync();
        return experiences.Select(MapToDto).ToList();
    }

    public async Task<ExperienceDto> CreateExperienceAsync(ExperienceCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ArgumentException("Title is required", nameof(dto));
        }

        // VALIDAÇÃO DE NEGÓCIO: EndDate deve ser >= StartDate
        if (dto.EndDate.HasValue && dto.EndDate < dto.StartDate)
        {
            throw new ArgumentException("EndDate must be greater than or equal to StartDate", nameof(dto));
        }

        // Se IsCurrent = true, não deve ter EndDate
        if (dto.IsCurrent && dto.EndDate.HasValue)
        {
            throw new ArgumentException("Current experience cannot have EndDate", nameof(dto));
        }

        // CORREÇÃO: PostgreSQL requer DateTime em UTC
        // Quando a data vem do JSON, ela vem com Kind=Unspecified
        // Precisamos normalizar para UTC antes de salvar
        var startDateUtc = dto.StartDate.Kind == DateTimeKind.Utc 
            ? dto.StartDate 
            : DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
        
        DateTime? endDateUtc = null;
        if (dto.EndDate.HasValue)
        {
            endDateUtc = dto.EndDate.Value.Kind == DateTimeKind.Utc
                ? dto.EndDate.Value
                : DateTime.SpecifyKind(dto.EndDate.Value, DateTimeKind.Utc);
        }

        var experience = new Experience
        {
            Title = dto.Title,
            Company = dto.Company,
            Description = dto.Description,
            StartDate = startDateUtc,
            EndDate = endDateUtc,
            IsCurrent = dto.IsCurrent,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
        };

        await _repository.AddAsync(experience);
        await _repository.SaveChangesAsync();

        return MapToDto(experience);
    }

    public async Task<ExperienceDto?> UpdateExperienceAsync(int id, ExperienceUpdateDto dto)
    {
        var experience = await _repository.GetByIdAsync(id);
        if (experience == null)
        {
            return null;
        }

        // Validações
        if (dto.Title != null && string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ArgumentException("Title cannot be empty", nameof(dto));
        }

        var startDate = dto.StartDate ?? experience.StartDate;
        var endDate = dto.EndDate ?? experience.EndDate;

        if (endDate.HasValue && endDate < startDate)
        {
            throw new ArgumentException("EndDate must be greater than or equal to StartDate", nameof(dto));
        }

        var isCurrent = dto.IsCurrent ?? experience.IsCurrent;
        if (isCurrent && endDate.HasValue)
        {
            throw new ArgumentException("Current experience cannot have EndDate", nameof(dto));
        }

        // Partial update
        if (dto.Title != null) experience.Title = dto.Title;
        if (dto.Company != null) experience.Company = dto.Company;
        if (dto.Description != null) experience.Description = dto.Description;
        
        // CORREÇÃO: Normalizar datas para UTC antes de salvar
        if (dto.StartDate.HasValue)
        {
            experience.StartDate = dto.StartDate.Value.Kind == DateTimeKind.Utc
                ? dto.StartDate.Value
                : DateTime.SpecifyKind(dto.StartDate.Value, DateTimeKind.Utc);
        }
        
        if (dto.EndDate.HasValue)
        {
            experience.EndDate = dto.EndDate.Value.Kind == DateTimeKind.Utc
                ? dto.EndDate.Value
                : DateTime.SpecifyKind(dto.EndDate.Value, DateTimeKind.Utc);
        }
        
        if (dto.IsCurrent.HasValue) experience.IsCurrent = dto.IsCurrent.Value;
        if (dto.DisplayOrder.HasValue) experience.DisplayOrder = dto.DisplayOrder.Value;
        if (dto.IsActive.HasValue) experience.IsActive = dto.IsActive.Value;

        experience.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(experience);
        await _repository.SaveChangesAsync();

        return MapToDto(experience);
    }

    public async Task<bool> DeleteExperienceAsync(int id)
    {
        var experience = await _repository.GetByIdAsync(id);
        if (experience == null)
        {
            return false;
        }

        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static ExperienceDto MapToDto(Experience experience)
    {
        return new ExperienceDto
        {
            Id = experience.Id,
            Title = experience.Title,
            Company = experience.Company,
            Description = experience.Description,
            StartDate = experience.StartDate,
            EndDate = experience.EndDate,
            IsCurrent = experience.IsCurrent,
            DisplayOrder = experience.DisplayOrder,
        };
    }
}
