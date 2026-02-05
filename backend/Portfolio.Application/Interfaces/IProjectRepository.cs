using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces;

/// <summary>
/// Interface do Repository para Projects.
/// 
/// POR QUÊ Interface?
/// - Define contrato (o que pode ser feito)
/// - Não define como (implementação fica em Infrastructure)
/// - Permite mock em testes
/// - Segue Dependency Inversion Principle (SOLID)
/// 
/// POR QUÊ em Application?
/// - Application define contratos (interfaces)
/// - Infrastructure implementa contratos
/// - API usa contratos (não conhece implementação)
/// 
/// REGRA: Application NUNCA conhece Infrastructure
/// </summary>
public interface IProjectRepository
{
    /// <summary>
    /// Busca projeto por ID.
    /// 
    /// POR QUÊ async?
    /// - Operações de I/O (banco) são assíncronas
    /// - Não bloqueia thread (melhor performance)
    /// - Padrão moderno em .NET
    /// </summary>
    Task<Project?> GetByIdAsync(int id);

    /// <summary>
    /// Busca todos os projetos ativos.
    /// 
    /// POR QUÊ método específico em vez de GetAll()?
    /// - Encapsula lógica de filtro (IsActive, !IsDeleted)
    /// - Controller não precisa saber como filtrar
    /// - Facilita mudanças (se regra mudar, muda só aqui)
    /// </summary>
    Task<List<Project>> GetActiveProjectsAsync();

    /// <summary>
    /// Busca todos os projetos (sem filtros).
    /// Útil para admin/dashboard.
    /// </summary>
    Task<List<Project>> GetAllAsync();

    /// <summary>
    /// Adiciona novo projeto.
    /// 
    /// POR QUÊ não retorna nada?
    /// - Id é gerado pelo banco (auto-increment)
    /// - Pode acessar project.Id depois de SaveChanges()
    /// - Padrão comum em repositories
    /// </summary>
    Task AddAsync(Project project);

    /// <summary>
    /// Atualiza projeto existente.
    /// 
    /// POR QUÊ não precisa buscar antes?
    /// - EF Core tracking gerencia isso
    /// - Se projeto veio do banco, EF Core sabe que existe
    /// - Se é novo, use AddAsync()
    /// </summary>
    Task UpdateAsync(Project project);

    /// <summary>
    /// Soft delete: marca como deletado.
    /// 
    /// POR QUÊ não Delete físico?
    /// - Preserva histórico
    /// - Permite recuperação
    /// - Atende LGPD
    /// </summary>
    Task DeleteAsync(int id);

    /// <summary>
    /// Salva mudanças no banco.
    /// 
    /// POR QUÊ método separado?
    /// - Unit of Work pattern
    /// - Pode fazer várias operações e salvar uma vez
    /// - Melhor performance (menos round-trips ao banco)
    /// 
    /// EXEMPLO:
    /// repository.AddAsync(project1);
    /// repository.AddAsync(project2);
    /// await repository.SaveChangesAsync(); // Salva ambos de uma vez
    /// </summary>
    Task<int> SaveChangesAsync();
}
