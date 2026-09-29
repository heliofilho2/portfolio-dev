namespace Collector;

public record NewsSource(string Name, string RssUrl, int MaxItems = 15);

public record RawNewsItem(
    string Title,
    string Url,
    string SourceName,
    DateTimeOffset PublishedAt,
    string RawSummary);

public record Classification(
    string TitlePt,
    string SummaryPt,
    string Category,
    string[] Topics,
    string Priority,
    string PriorityReason,
    bool Discard);

public static class Taxonomy
{
    public static readonly string[] Categories = ["IA", "Big Tech", "Dev Tools", "Linguagens", "Pesquisa", "Outro"];

    // Lista fechada para os filtros do site ficarem consistentes
    public static readonly string[] Topics =
    [
        "Claude", "OpenAI", "Google", "Meta", "Apple", "Microsoft", "Samsung", "Nvidia", "Amazon",
        "IA generativa", "Agentes", "Open Source", "Segurança", "Regulação", "Hardware",
        "Carros Elétricos", "Realidade aumentada", "Brasil",
    ];

    public static readonly string[] Priorities = ["alta", "media", "baixa"];
}

public static class NewsSources
{
    // Confira os feeds de tempos em tempos: `dotnet run -- --dry-run` mostra quantos itens cada um trouxe.
    // A Anthropic não publica RSS oficial; as novidades dela chegam via Simon Willison e pela imprensa.
    public static readonly NewsSource[] All =
    [
        new("OpenAI Blog", "https://openai.com/news/rss.xml"),
        new("Google DeepMind Blog", "https://deepmind.google/blog/rss.xml"),
        new("The Verge", "https://www.theverge.com/rss/index.xml"),
        new("Ars Technica", "https://feeds.arstechnica.com/arstechnica/index"),
        new("MIT Technology Review", "https://www.technologyreview.com/feed/"),
        new("Simon Willison", "https://simonwillison.net/atom/everything/"),
        new("GitHub Blog", "https://github.blog/feed/"),
        new("Tecnoblog", "https://tecnoblog.net/feed/"),
        new("arXiv cs.AI", "https://rss.arxiv.org/rss/cs.AI", MaxItems: 8),
    ];
}
