namespace Portfolio.Domain.Entities;

/// <summary>
/// Classe base para todas as entidades do domínio.
/// 
/// POR QUÊ?
/// - Todas as entidades precisam de Id (chave primária)
/// - Todas precisam de CreatedAt/UpdatedAt para auditoria
/// - Evita duplicação de código (DRY - Don't Repeat Yourself)
/// - Facilita queries comuns (ex: buscar por data de criação)
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Identificador único da entidade.
    /// Usamos int porque:
    /// - Simples e eficiente
    /// - Auto-incremento no banco
    /// - Suficiente para a maioria dos casos
    /// 
    /// Trade-off: Se precisar de bilhões de registros, usar Guid ou long
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Data de criação do registro.
    /// Útil para:
    /// - Auditoria
    /// - Ordenação por data
    /// - Análise de crescimento
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização.
    /// Útil para:
    /// - Saber quando algo foi modificado
    /// - Cache invalidation
    /// - Debugging
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Soft delete: marca como deletado sem remover do banco.
    /// 
    /// POR QUÊ Soft Delete?
    /// - Preserva histórico
    /// - Permite recuperação
    /// - Atende LGPD (dados podem ser "deletados" mas mantidos para auditoria)
    /// 
    /// Trade-off: Queries precisam filtrar IsDeleted == false
    /// </summary>
    public bool IsDeleted { get; set; } = false;
}
