using Npgsql;

namespace Collector;

public class NewsRepository(NpgsqlDataSource db)
{
    public async Task<HashSet<string>> GetExistingUrlsAsync(IReadOnlyCollection<string> urls, CancellationToken ct)
    {
        await using var cmd = db.CreateCommand("select url from news_items where url = any(@urls)");
        cmd.Parameters.AddWithValue("urls", urls.ToArray());
        await using var reader = await cmd.ExecuteReaderAsync(ct);

        var existing = new HashSet<string>();
        while (await reader.ReadAsync(ct)) existing.Add(reader.GetString(0));
        return existing;
    }

    public async Task InsertAsync(RawNewsItem item, Classification c, CancellationToken ct)
    {
        await using var cmd = db.CreateCommand("""
            insert into news_items (url, title, title_pt, source, published_at, summary_pt, category, topics, priority, priority_reason, hidden)
            values (@url, @title, @title_pt, @source, @published_at, @summary_pt, @category, @topics, @priority, @priority_reason, @hidden)
            on conflict (url) do nothing
            """);
        cmd.Parameters.AddWithValue("url", item.Url);
        cmd.Parameters.AddWithValue("title", item.Title);
        cmd.Parameters.AddWithValue("title_pt", c.TitlePt);
        cmd.Parameters.AddWithValue("source", item.SourceName);
        cmd.Parameters.AddWithValue("published_at", item.PublishedAt.ToUniversalTime());
        cmd.Parameters.AddWithValue("summary_pt", c.SummaryPt);
        cmd.Parameters.AddWithValue("category", c.Category);
        cmd.Parameters.AddWithValue("topics", c.Topics);
        cmd.Parameters.AddWithValue("priority", c.Priority);
        cmd.Parameters.AddWithValue("priority_reason", c.PriorityReason);
        // Descartados ficam gravados como ocultos para não serem reclassificados (e pagos) de novo
        cmd.Parameters.AddWithValue("hidden", c.Discard);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public record BodyCandidate(long Id, string Url, string Source, string TitlePt, string SummaryPt);

    // Prioridade alta OU em alta, sem matéria completa ainda tentada. Cobre tanto o que acabou
    // de ser classificado nesta execução quanto notícia antiga que só ficou "em alta" agora.
    public async Task<List<BodyCandidate>> GetNeedsBodyAsync(TimeSpan window, CancellationToken ct)
    {
        await using var cmd = db.CreateCommand("""
            select id, url, source, title_pt, summary_pt from news_items
            where not hidden and body_pt is null and published_at >= @since
              and (priority = 'alta' or trending)
            """);
        cmd.Parameters.AddWithValue("since", DateTimeOffset.UtcNow - window);
        await using var reader = await cmd.ExecuteReaderAsync(ct);

        var list = new List<BodyCandidate>();
        while (await reader.ReadAsync(ct))
            list.Add(new(reader.GetInt64(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetString(4)));
        return list;
    }

    // body vazio = tentado e sem texto-fonte suficiente (não tenta de novo); texto = matéria publicada.
    public async Task UpdateBodyAsync(long id, string body, CancellationToken ct)
    {
        await using var cmd = db.CreateCommand("update news_items set body_pt = @body where id = @id");
        cmd.Parameters.AddWithValue("body", body);
        cmd.Parameters.AddWithValue("id", id);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    // Recalcula "em alta" na janela inteira, incluindo notícias de execuções anteriores
    public async Task<int> RecomputeTrendingAsync(TimeSpan window, CancellationToken ct)
    {
        var items = new List<TrendingDetector.Item>();
        await using (var cmd = db.CreateCommand("select id, source, title, title_pt from news_items where published_at >= @since and not hidden"))
        {
            cmd.Parameters.AddWithValue("since", DateTimeOffset.UtcNow - window);
            await using var reader = await cmd.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
                items.Add(new(reader.GetInt64(0), reader.GetString(1), reader.GetString(2) + " " + reader.GetString(3)));
        }

        var trendingIds = TrendingDetector.Detect(items).ToArray();
        var ids = items.Select(i => i.Id).ToArray();

        await using var update = db.CreateCommand("update news_items set trending = (id = any(@trending)) where id = any(@ids)");
        update.Parameters.AddWithValue("trending", trendingIds);
        update.Parameters.AddWithValue("ids", ids);
        await update.ExecuteNonQueryAsync(ct);
        return trendingIds.Length;
    }

    // Supabase entrega a connection string no formato URI; o Npgsql espera chave=valor
    public static string ToNpgsqlConnectionString(string value)
    {
        if (!value.StartsWith("postgres", StringComparison.OrdinalIgnoreCase) || !value.Contains("://")) return value;

        var uri = new Uri(value);
        var userInfo = uri.UserInfo.Split(':', 2);
        return new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = uri.AbsolutePath.TrimStart('/'),
            Username = Uri.UnescapeDataString(userInfo[0]),
            Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : null,
            SslMode = SslMode.Require,
        }.ConnectionString;
    }
}
