using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

/// <summary>
/// Service para Profile.
/// 
/// LÓGICA DE NEGÓCIO:
/// - Profile é singleton (apenas um registro)
/// - Upsert: Se existe, atualiza. Se não, cria.
/// </summary>
public class ProfileService : IProfileService
{
    private readonly IProfileRepository _repository;

    public ProfileService(IProfileRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<ProfileDto?> GetProfileAsync()
    {
        var profile = await _repository.GetProfileAsync();
        if (profile == null) return null;
        
        // Debug: verificar se AboutText está sendo lido
        System.Diagnostics.Debug.WriteLine($"Profile.AboutText from DB: {profile.AboutText ?? "NULL"}");
        
        return MapToDto(profile);
    }

    public async Task<ProfileDto> UpsertProfileAsync(ProfileUpdateDto dto)
    {
        // Busca perfil existente
        var existingProfile = await _repository.GetProfileAsync();

        if (existingProfile != null)
        {
            // Atualiza campos fornecidos (partial update)
            if (dto.Name != null) existingProfile.Name = dto.Name;
            if (dto.Role != null) existingProfile.Role = dto.Role;
            if (dto.Location != null) existingProfile.Location = dto.Location;
            if (dto.Languages != null) existingProfile.Languages = dto.Languages;
            if (dto.Description != null) existingProfile.Description = dto.Description;
            if (dto.AvatarUrl != null) existingProfile.AvatarUrl = dto.AvatarUrl;
            if (dto.ExperienceYears != null) existingProfile.ExperienceYears = dto.ExperienceYears;
            if (dto.CoreEngine != null) existingProfile.CoreEngine = dto.CoreEngine;
            if (dto.Database != null) existingProfile.Database = dto.Database;
            if (dto.Email != null) existingProfile.Email = dto.Email;
            if (dto.GitHubUrl != null) existingProfile.GitHubUrl = dto.GitHubUrl;
            if (dto.LinkedInUrl != null) existingProfile.LinkedInUrl = dto.LinkedInUrl;
            if (dto.Specialized != null) existingProfile.Specialized = dto.Specialized;
            if (dto.Certifications != null) existingProfile.Certifications = dto.Certifications;
            if (dto.AboutText != null) existingProfile.AboutText = dto.AboutText;

            existingProfile.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(existingProfile);
            await _repository.SaveChangesAsync();

            return MapToDto(existingProfile);
        }
        else
        {
            // Cria novo perfil
            var newProfile = new Profile
            {
                Name = dto.Name ?? string.Empty,
                Role = dto.Role ?? string.Empty,
                Location = dto.Location,
                Languages = dto.Languages,
                Description = dto.Description,
                AvatarUrl = dto.AvatarUrl,
                ExperienceYears = dto.ExperienceYears,
                CoreEngine = dto.CoreEngine,
                Database = dto.Database,
                Email = dto.Email,
                GitHubUrl = dto.GitHubUrl,
                LinkedInUrl = dto.LinkedInUrl,
                Specialized = dto.Specialized,
                Certifications = dto.Certifications,
                AboutText = dto.AboutText,
            };

            await _repository.AddAsync(newProfile);
            await _repository.SaveChangesAsync();

            return MapToDto(newProfile);
        }
    }

    private static ProfileDto MapToDto(Profile profile)
    {
        var dto = new ProfileDto
        {
            Id = profile.Id,
            Name = profile.Name,
            Role = profile.Role,
            Location = profile.Location,
            Languages = profile.Languages,
            Description = profile.Description,
            AvatarUrl = profile.AvatarUrl,
            ExperienceYears = profile.ExperienceYears,
            CoreEngine = profile.CoreEngine,
            Database = profile.Database,
            Email = profile.Email,
            GitHubUrl = profile.GitHubUrl,
            LinkedInUrl = profile.LinkedInUrl,
            Specialized = profile.Specialized,
            Certifications = profile.Certifications,
            AboutText = profile.AboutText,
        };
        
        // Debug: verificar se AboutText está sendo mapeado
        System.Diagnostics.Debug.WriteLine($"ProfileDto.AboutText after mapping: {dto.AboutText ?? "NULL"}");
        
        return dto;
    }
}
