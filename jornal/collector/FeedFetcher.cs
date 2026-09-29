using System.Net;
using System.ServiceModel.Syndication;
using System.Text.RegularExpressions;
using System.Xml;

namespace Collector;

public partial class FeedFetcher(HttpClient http)
{
    private const int MaxSummaryChars = 1500;

    public async Task<List<RawNewsItem>> FetchAsync(NewsSource source, DateTimeOffset since, CancellationToken ct)
    {
        await using var stream = await http.GetStreamAsync(source.RssUrl, ct);
        using var reader = XmlReader.Create(stream, new XmlReaderSettings { DtdProcessing = DtdProcessing.Ignore, Async = true });
        var feed = SyndicationFeed.Load(reader);

        return feed.Items
            .Select(item => new RawNewsItem(
                Title: CleanText(item.Title?.Text ?? ""),
                Url: item.Links.FirstOrDefault(l => l.RelationshipType is null or "alternate")?.Uri.ToString()
                     ?? item.Links.FirstOrDefault()?.Uri.ToString() ?? "",
                SourceName: source.Name,
                PublishedAt: item.PublishDate != default ? item.PublishDate : item.LastUpdatedTime,
                RawSummary: Truncate(CleanText(item.Summary?.Text ?? (item.Content as TextSyndicationContent)?.Text ?? ""))))
            .Where(i => i.Url.Length > 0 && i.Title.Length > 0 && i.PublishedAt >= since && !PromoRegex().IsMatch(i.Title))
            .OrderByDescending(i => i.PublishedAt)
            .Take(source.MaxItems)
            .ToList();
    }

    // Feeds trazem HTML no resumo; o modelo só precisa do texto
    private static string CleanText(string html) =>
        WhitespaceRegex().Replace(WebUtility.HtmlDecode(TagRegex().Replace(html, " ")), " ").Trim();

    private static string Truncate(string text) =>
        text.Length <= MaxSummaryChars ? text : text[..MaxSummaryChars] + "…";

    // Ofertas óbvias saem antes de gastar uma chamada ao Claude
    [GeneratedRegex(@"\bR\$\s?\d|\bOFF\b|cupom|desconto|promo[cç][aã]o|oferta|cai de pre[cç]o|black friday|\bdeal(s)?\b", RegexOptions.IgnoreCase)]
    private static partial Regex PromoRegex();

    [GeneratedRegex("<[^>]+>")]
    private static partial Regex TagRegex();

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRegex();
}
