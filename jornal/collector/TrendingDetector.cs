using System.Globalization;
using System.Text;

namespace Collector;

// Heurística do MVP: notícias de fontes diferentes que compartilham 2+ termos relevantes
// (nomes de empresas, produtos, modelos) na mesma janela ficam "em alta".
// O texto inclui o título original e o traduzido, para cruzar fontes em inglês e em português.
public static class TrendingDetector
{
    public record Item(long Id, string Source, string Text);

    private const int MinSharedTerms = 2;

    private static readonly HashSet<string> StopWords =
    [
        // en
        "about", "after", "again", "against", "also", "been", "being", "before", "between", "could", "does",
        "from", "have", "here", "into", "just", "like", "more", "most", "much", "ness", "only", "other", "over",
        "says", "said", "some", "such", "than", "that", "their", "them", "then", "there", "these", "they",
        "this", "those", "through", "under", "until", "very", "what", "when", "where", "which", "while",
        "will", "with", "would", "your", "year", "years", "week", "today", "first", "launches", "announces",
        "introducing", "update", "updates", "using", "make", "makes", "gets", "want", "wants", "people", "company",
        // pt
        "aqui", "ainda", "antes", "assim", "ate", "como", "contra", "desde", "depois", "entre", "essa", "esse",
        "esta", "este", "estao", "isso", "mais", "mesmo", "muito", "nova", "novo", "novas", "novos",
        "onde", "para", "pela", "pelo", "pode", "podem", "quando", "sobre", "tambem", "sera", "seus", "suas",
        "sem", "anuncia", "lanca", "lancamento", "empresa", "agora", "diz", "afirma", "anos", "hoje",
    ];

    public static IEnumerable<long> Detect(IReadOnlyList<Item> items)
    {
        var terms = items.ToDictionary(i => i.Id, i => Terms(i.Text));

        foreach (var item in items)
        {
            var mine = terms[item.Id];
            var hit = items.Any(other =>
                other.Source != item.Source &&
                terms[other.Id].Count(mine.Contains) >= MinSharedTerms);

            if (hit) yield return item.Id;
        }
    }

    private static HashSet<string> Terms(string text)
    {
        var normalized = RemoveAccents(text.ToLowerInvariant());
        var words = normalized
            .Split((char[])[' ', ',', '.', ':', ';', '!', '?', '"', '\'', '(', ')', '[', ']', '’', '‘', '“', '”', '|', '/', '–', '—'],
                StringSplitOptions.RemoveEmptyEntries)
            .Select(w => w.Trim('-'))
            .Where(w => w.Length >= 4 && !StopWords.Contains(w) && !int.TryParse(w, out _));

        return words.ToHashSet();
    }

    private static string RemoveAccents(string text)
    {
        var decomposed = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(decomposed.Length);
        foreach (var c in decomposed)
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark) sb.Append(c);
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
