using HtmlAgilityPack;

namespace Collector;

// Busca a página da matéria original e extrai só o texto do corpo, pra alimentar o NewsWriter
// com o artigo de verdade (o RSS só dá um resumo curto). Melhor esforço: cada site tem uma
// estrutura de HTML diferente, então isso falha de vez em quando (paywall, bloqueio de robô,
// conteúdo carregado por JavaScript) — nesse caso devolve null, e quem chama não força um texto
// raso a partir disso.
public class ArticleExtractor(HttpClient http)
{
    private const int MinChars = 350; // abaixo disso, provavelmente a extração falhou
    private const int MaxChars = 6000; // teto pra não inflar o custo da chamada ao Claude
    private const int MinParagraphChars = 40; // descarta legenda, nav residual etc.

    private static readonly string[] IgnoredTags = ["script", "style", "noscript", "nav", "header", "footer", "aside", "form", "iframe", "svg"];
    private static readonly string[] ParagraphTags = ["p", "li", "blockquote"];

    public record Result(string? Text, string? ImageUrl);

    public async Task<Result> ExtractAsync(string url, CancellationToken ct)
    {
        try
        {
            var html = await http.GetStringAsync(url, ct);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var imageUrl = ImageOf(doc, url);

            foreach (var tag in IgnoredTags)
                foreach (var node in doc.DocumentNode.SelectNodes($"//{tag}") ?? Enumerable.Empty<HtmlNode>())
                    node.Remove();

            // Páginas de blog costumam ter vários <article> (o post e cards de "veja também" na
            // barra lateral). Em vez de confiar no primeiro, testa cada um como candidato e fica
            // com o que tem mais texto de parágrafo — é o que de fato é o corpo da matéria.
            var candidates = (doc.DocumentNode.SelectNodes("//article") ?? Enumerable.Empty<HtmlNode>())
                .Append(doc.DocumentNode)
                .Select(ParagraphsOf)
                .OrderByDescending(p => p.Sum(t => t.Length));

            var paragraphs = candidates.FirstOrDefault() ?? [];
            var text = string.Join("\n\n", paragraphs);
            if (text.Length > MaxChars) text = text[..MaxChars];

            return new Result(text.Length >= MinChars ? text : null, imageUrl);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            Console.Error.WriteLine($"[extrator] falha em {url}: {ex.Message}");
            return new Result(null, null);
        }
    }

    // og:image primeiro (padrão de artigo de notícia), twitter:image como segunda tentativa.
    // Relativa vira absoluta a partir da própria URL da matéria.
    private static string? ImageOf(HtmlDocument doc, string pageUrl)
    {
        var raw =
            doc.DocumentNode.SelectSingleNode("//meta[@property='og:image']")?.GetAttributeValue("content", null)
            ?? doc.DocumentNode.SelectSingleNode("//meta[@name='twitter:image']")?.GetAttributeValue("content", null);
        if (string.IsNullOrWhiteSpace(raw)) return null;

        return Uri.TryCreate(new Uri(pageUrl), raw, out var abs) && (abs.Scheme == "http" || abs.Scheme == "https")
            ? abs.ToString()
            : null;
    }

    private static List<string> ParagraphsOf(HtmlNode scope) =>
        ParagraphTags
            .SelectMany(tag => scope.SelectNodes($".//{tag}") ?? Enumerable.Empty<HtmlNode>())
            .Select(p => CollapseWhitespace(HtmlEntity.DeEntitize(p.InnerText).Trim()))
            .Where(t => t.Length >= MinParagraphChars)
            .ToList();

    private static string CollapseWhitespace(string text) => string.Join(' ', text.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries));
}
