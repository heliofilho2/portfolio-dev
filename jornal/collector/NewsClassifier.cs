using System.Text.Json;
using Anthropic;
using Anthropic.Models.Beta.Messages;

namespace Collector;

public class NewsClassifier(AnthropicClient client, string model)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    // Estável entre chamadas (sem data/hora) para o cache de prompt funcionar
    private static readonly string SystemPrompt = $"""
        Você é o editor do SINAL, um jornal diário de tecnologia e IA para o público brasileiro.
        Tom: sério, técnico, sem sensacionalismo. Nada de adjetivos de hype nem exclamações.

        Para cada notícia recebida, produza:
        - title_pt: o título em português, fiel ao original, sem clickbait.
        - summary_pt: resumo em até 2 frases, em português, dizendo o que aconteceu e por que importa.
        - category: uma de {string.Join(", ", Taxonomy.Categories)}.
        - topics: de 0 a 3 tópicos, apenas desta lista: {string.Join(", ", Taxonomy.Topics)}. Use só os que a notícia trata diretamente.
        - priority e priority_reason (uma frase curta).
        - discard: true quando o item não é notícia de tecnologia — oferta, cupom, review de produto à venda,
          tutorial genérico ("como fazer X"), política sem relação com tecnologia. Nos demais casos, false.

        Critério de prioridade:
        - alta: lançamento de modelo ou produto de um player grande (OpenAI, Anthropic, Google, Meta, Microsoft, Apple),
          mudança regulatória relevante, ou avanço amplamente coberto.
        - media: ferramenta ou framework relevante para devs, rodada de investimento grande,
          atualização importante de linguagem ou runtime.
        - baixa: notícia de nicho, opinião, atualização incremental.
        """;

    private static readonly Dictionary<string, JsonElement> Schema = new()
    {
        ["type"] = JsonSerializer.SerializeToElement("object"),
        ["additionalProperties"] = JsonSerializer.SerializeToElement(false),
        ["required"] = JsonSerializer.SerializeToElement(new[] { "title_pt", "summary_pt", "category", "topics", "priority", "priority_reason", "discard" }),
        ["properties"] = JsonSerializer.SerializeToElement(new Dictionary<string, object>
        {
            ["title_pt"] = new { type = "string" },
            ["summary_pt"] = new { type = "string" },
            ["category"] = new { type = "string", @enum = Taxonomy.Categories },
            ["topics"] = new { type = "array", items = new { type = "string", @enum = Taxonomy.Topics } },
            ["priority"] = new { type = "string", @enum = Taxonomy.Priorities },
            ["priority_reason"] = new { type = "string" },
            ["discard"] = new { type = "boolean" },
        }),
    };

    public long InputTokens;
    public long OutputTokens;
    public long CacheReadTokens;

    public async Task<Classification?> ClassifyAsync(RawNewsItem item, CancellationToken ct)
    {
        var response = await client.Beta.Messages.Create(new MessageCreateParams
        {
            Model = model,
            MaxTokens = 4096,
            Betas = ["server-side-fallback-2026-06-01"],
            Fallbacks = new List<BetaFallbackParam> { new() { Model = "claude-opus-4-8" } },
            System = new List<BetaTextBlockParam>
            {
                new() { Text = SystemPrompt, CacheControl = new BetaCacheControlEphemeral() },
            },
            OutputConfig = new BetaOutputConfig
            {
                Effort = Effort.Low,
                Format = new BetaJsonOutputFormat { Schema = Schema },
            },
            Messages =
            [
                new BetaMessageParam
                {
                    Role = Role.User,
                    Content = $"Fonte: {item.SourceName}\nTítulo: {item.Title}\nResumo original: {item.RawSummary}",
                },
            ],
        }, cancellationToken: ct);

        Interlocked.Add(ref InputTokens, response.Usage.InputTokens);
        Interlocked.Add(ref OutputTokens, response.Usage.OutputTokens);
        Interlocked.Add(ref CacheReadTokens, response.Usage.CacheReadInputTokens ?? 0);

        if (response.StopReason != "end_turn")
        {
            Console.Error.WriteLine($"[classificador] '{item.Title}' ignorada: stop_reason={response.StopReason}");
            return null;
        }

        var json = response.Content.Select(b => b.Value).OfType<BetaTextBlock>().FirstOrDefault()?.Text;
        var raw = json is null ? null : JsonSerializer.Deserialize<RawClassification>(json, JsonOptions);
        return raw is null
            ? null
            : new Classification(raw.title_pt, raw.summary_pt, raw.category, raw.topics, raw.priority, raw.priority_reason, raw.discard);
    }

    private record RawClassification(
        string title_pt, string summary_pt, string category, string[] topics, string priority, string priority_reason, bool discard);
}
