using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Data;

/// <summary>
/// DbContext é a ponte entre suas entidades (C#) e o banco de dados (PostgreSQL).
/// 
/// O QUE É DbContext?
/// - Representa uma sessão com o banco de dados
/// - Permite fazer queries, inserções, atualizações
/// - Gerencia o estado das entidades (tracking)
/// - Converte LINQ em SQL
/// 
/// POR QUÊ no Infrastructure?
/// - DbContext é uma implementação técnica (EF Core)
/// - Domain não deve conhecer EF Core
/// - Infrastructure é onde vivem detalhes de implementação
/// 
/// PATTERN: Unit of Work
/// - DbContext gerencia transações
/// - SaveChanges() persiste todas as mudanças
/// - Rollback automático em caso de erro
/// </summary>
public class PortfolioDbContext : DbContext
{
    /// <summary>
    /// Construtor que recebe DbContextOptions.
    /// 
    /// POR QUÊ via Options?
    /// - Permite configurar connection string externamente
    /// - Facilita testes (pode usar InMemory database)
    /// - Segue Dependency Injection pattern
    /// </summary>
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// DbSet representa uma tabela no banco.
    /// 
    /// POR QUÊ DbSet?
    /// - Type-safe queries
    /// - IntelliSense funciona
    /// - EF Core sabe quais entidades mapear
    /// 
    /// Nome da propriedade = Nome da tabela (por padrão)
    /// Ex: Projects -> tabela "Projects"
    /// </summary>
    public DbSet<Project> Projects { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Profile> Profiles { get; set; }

    /// <summary>
    /// OnModelCreating permite configurar o mapeamento entidade -> tabela.
    /// 
    /// POR QUÊ configurar aqui?
    /// - Define índices para performance
    /// - Configura relacionamentos
    /// - Define constraints
    /// - Configura valores padrão
    /// 
    /// FLUENT API vs Data Annotations:
    /// - Fluent API (aqui): Mais controle, código centralizado
    /// - Data Annotations ([Required], etc.): Mais simples, mas mistura configuração com entidade
    /// 
    /// DECISÃO: Usamos Fluent API para manter Domain limpo
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ========== PROJECT CONFIGURATION ==========
        modelBuilder.Entity<Project>(entity =>
        {
            // Tabela
            entity.ToTable("Projects");

            // Chave primária
            entity.HasKey(p => p.Id);

            // Índices para performance
            // POR QUÊ índices?
            // - Queries por IsActive são comuns (filtrar projetos ativos)
            // - Queries por DisplayOrder são comuns (ordenar)
            // - Índices aceleram SELECT, mas desaceleram INSERT/UPDATE
            // - Trade-off: Use índices em colunas usadas em WHERE/ORDER BY
            entity.HasIndex(p => p.IsActive);
            entity.HasIndex(p => p.DisplayOrder);

            // Configurações de coluna
            entity.Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(200); // Limita tamanho para evitar dados gigantes

            entity.Property(p => p.Category)
                .HasMaxLength(100);

            entity.Property(p => p.Description)
                .HasMaxLength(2000);

            entity.Property(p => p.Tags)
                .HasMaxLength(500);

            // Valores padrão
            entity.Property(p => p.IsActive)
                .HasDefaultValue(true);

            entity.Property(p => p.DisplayOrder)
                .HasDefaultValue(0);

            // Soft delete: Filtrar automaticamente
            // POR QUÊ?
            // - Evita esquecer de filtrar IsDeleted == false
            // - Queries automáticas excluem deletados
            entity.HasQueryFilter(p => !p.IsDeleted);
        });

        // ========== SKILL CONFIGURATION ==========
        modelBuilder.Entity<Skill>(entity =>
        {
            entity.ToTable("Skills");

            entity.HasKey(s => s.Id);

            // Índice composto: Category + DisplayOrder
            // POR QUÊ composto?
            // - Queries geralmente filtram por categoria E ordenam
            // - Índice composto acelera essa query específica
            entity.HasIndex(s => new { s.Category, s.DisplayOrder });

            entity.HasIndex(s => s.IsActive);

            entity.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(100);

            // Enum como int no banco (mais eficiente que string)
            entity.Property(s => s.Category)
                .HasConversion<int>(); // Salva como int, converte para enum

            // Validação: Proficiency entre 0 e 100
            entity.Property(s => s.Proficiency)
                .HasDefaultValue(0);

            // Check constraint (validação no banco)
            // POR QUÊ no banco também?
            // - Segurança: Mesmo se código tiver bug, banco valida
            // - Performance: Validação no banco é mais rápida
            // - Trade-off: Migrations ficam mais complexas
            // Nota: PostgreSQL suporta check constraints, mas EF Core tem limitações
            // Por enquanto, validamos apenas no código (DTOs/Services)

            entity.HasQueryFilter(s => !s.IsDeleted);
        });

        // ========== EXPERIENCE CONFIGURATION ==========
        modelBuilder.Entity<Experience>(entity =>
        {
            entity.ToTable("Experiences");

            entity.HasKey(e => e.Id);

            // Índice para ordenar por data (mais recente primeiro)
            entity.HasIndex(e => new { e.StartDate, e.DisplayOrder });

            entity.HasIndex(e => e.IsCurrent); // Filtrar posição atual

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Company)
                .HasMaxLength(200);

            entity.Property(e => e.Description)
                .HasMaxLength(2000);

            // Validação: EndDate deve ser >= StartDate
            // Isso será validado no Service/Application layer
            // EF Core não tem suporte nativo para isso facilmente

            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // ========== PROFILE CONFIGURATION ==========
        modelBuilder.Entity<Profile>(entity =>
        {
            entity.ToTable("Profiles");

            entity.HasKey(p => p.Id);

            // Profile é singleton, então não precisa de índices complexos
            // Mas podemos indexar campos comuns se necessário

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(p => p.Role)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(p => p.Location)
                .HasMaxLength(100);

            entity.Property(p => p.Languages)
                .HasMaxLength(200);

            entity.Property(p => p.Description)
                .HasMaxLength(2000);

            entity.Property(p => p.AvatarUrl)
                .HasMaxLength(500);

            entity.Property(p => p.ExperienceYears)
                .HasMaxLength(50);

            entity.Property(p => p.CoreEngine)
                .HasMaxLength(200);

            entity.Property(p => p.Database)
                .HasMaxLength(200);

            entity.Property(p => p.Email)
                .HasMaxLength(200);

            entity.Property(p => p.GitHubUrl)
                .HasMaxLength(500);

            entity.Property(p => p.LinkedInUrl)
                .HasMaxLength(500);

            entity.Property(p => p.Specialized)
                .HasMaxLength(200);

            entity.Property(p => p.Certifications)
                .HasMaxLength(500);

            entity.Property(p => p.AboutText)
                .HasMaxLength(3000); // Texto mais longo para permitir parágrafos

            entity.HasQueryFilter(p => !p.IsDeleted);
        });
    }
}
