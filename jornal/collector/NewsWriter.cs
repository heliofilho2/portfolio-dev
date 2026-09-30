using System.Text.Json;
using Anthropic;
using Anthropic.Models.Beta.Messages;

namespace Collector;

// Escreve a matéria completa (corpo de 2 a 4 parágrafos) só para notícias de prioridade alta
// ou em alta — ver NewsRepository.GetNeedsBodyAsync. Só roda depois que o ArticleExtractor
// conseguiu o texto real da fonte; nunca inventa a partir do resumo curto sozinho.
public class NewsWriter(AnthropicClient client, string model)
{
    private static readonly string SystemPrompt = """
        Você é o editor do SINAL, um jornal diário de tecnologia e IA para o público brasileiro.
        Sua tarefa: expandir uma notícia já resumida numa matéria curta, em português, usando
        SOMENTE o texto-fonte fornecido.

        Regras de conteúdo (as mais importantes):
        - Só afirme o que está no texto-fonte. Nenhum número, data, nome ou citação que não
          esteja lá. Se o texto-fonte não dá detalhe suficiente para algum ângulo, não cubra
          esse ângulo — não complete com suposição.
        - Cite a fonte pelo nome pelo menos uma vez no corpo (ex.: "Segundo o TechCrunch...",
          "Em post no blog da OpenAI...").
        - Mantenha a mesma leitura dos fatos que o texto-fonte tem. Não infle nem minimize a
          importância do que aconteceu.

        Regras de estilo (formal, mas humano):
        - Terceira pessoa, tom de editor de jornal sério, sem hype e sem sensacionalismo.
        - Proibido usar travessão (—) em qualquer lugar do texto. Use vírgula, dois-pontos ou
          frases separadas por ponto.
        - Proibido repetir a mesma informação com outras palavras no parágrafo seguinte.
        - Proibido clichê de texto gerado por IA: "é importante notar que", "vale ressaltar",
          "no cenário atual", "em um mundo cada vez mais", "sem dúvida", ponto de exclamação,
          adjetivo de hype ("revolucionário", "impressionante").
        - 2 a 4 parágrafos curtos. Prefira menos parágrafos e diretos a encher linha com o
          texto-fonte curto: não existe obrigação de tamanho mínimo.

        Responda só com o campo "body_pt": os parágrafos separados por uma linha em branco
        (\n\n), sem título e sem repetir o resumo original.
        """;

    private static readonly Dictionary<string, JsonElement> Schema = new()
    {
        ["type"] = JsonSerializer.SerializeToElement("object"),
        ["additionalProperties"] = JsonSerializer.SerializeToElement(false),
        ["required"] = JsonSerializer.SerializeToElement(new[] { "body_pt" }),
        ["properties"] = JsonSerializer.SerializeToElement(new Dictionary<string, object>
        {
            ["body_pt"] = new { type = "string" },
        }),
    };

    public long InputTokens;
    public long OutputTokens;
    public long CacheReadTokens;

    public async Task<string?> WriteAsync(string titlePt, string summaryPt, string source, string sourceText, CancellationToken ct)
    {
        var response = await client.Beta.Messages.Create(new MessageCreateParams
        {
            Model = model,
            MaxTokens = 1536,
            Betas = ["server-side-fallback-2026-06-01"],
            Fallbacks = new List<BetaFallbackParam> { new() { Model = "claude-opus-4-8" } },
            System = new List<BetaTextBlockParam>
            {
                new() { Text = SystemPrompt, CacheControl = new BetaCacheControlEphemeral() },
            },
            OutputConfig = new BetaOutputConfig
            {
                Format = new BetaJsonOutputFormat { Schema = Schema },
            },
            Messages =
            [
                new BetaMessageParam
                {
                    Role = Role.User,
                    Content = $"Fonte: {source}\nTítulo já traduzido: {titlePt}\nResumo já publicado: {summaryPt}\n\nTexto-fonte extraído da página original:\n{sourceText}",
                },
            ],
        }, cancellationToken: ct);

        Interlocked.Add(ref InputTokens, response.Usage.InputTokens);
        Interlocked.Add(ref OutputTokens, response.Usage.OutputTokens);
        Interlocked.Add(ref CacheReadTokens, response.Usage.CacheReadInputTokens ?? 0);

        if (response.StopReason != "end_turn")
        {
            Console.Error.WriteLine($"[matéria] '{titlePt}' ignorada: stop_reason={response.StopReason}");
            return null;
        }

        var json = response.Content.Select(b => b.Value).OfType<BetaTextBlock>().FirstOrDefault()?.Text;
        var raw = json is null ? null : JsonSerializer.Deserialize<RawBody>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        var body = raw?.body_pt?.Trim();
        return string.IsNullOrWhiteSpace(body) ? null : body;
    }

    private record RawBody(string? body_pt);
}
