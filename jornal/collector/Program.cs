using Anthropic;
using Anthropic.Exceptions;
using Collector;
using Npgsql;

// Corpo da resposta da Anthropic quando a chamada falha, se disponível (mensagem genérica
// de exceção do SDK não diz o motivo real do 400).
static string Detail(Exception ex) => ex is AnthropicApiException api ? $"{ex.Message} — {api.ResponseBody}" : ex.Message;

// Execução única (Railway Cron): coleta RSS → descarta o que já está no banco → classifica com Claude → grava → recalcula "em alta".
// `dotnet run -- --dry-run` só lê os feeds e mostra o que seria processado (sem Claude e sem banco).

var dryRun = args.Contains("--dry-run");
var lookback = TimeSpan.FromHours(double.Parse(Environment.GetEnvironmentVariable("LOOKBACK_HOURS") ?? "48"));
// Classificação é mecânica e de alto volume: modelo barato. A matéria completa (abaixo) é o que
// o leitor de fato lê, então usa um modelo melhor, só pra prioridade alta/em alta.
var model = Environment.GetEnvironmentVariable("CLAUDE_MODEL") ?? "claude-haiku-4-5-20251001";
var writerModel = Environment.GetEnvironmentVariable("CLAUDE_WRITER_MODEL") ?? "claude-sonnet-5";
using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(20));
var ct = cts.Token;

using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
http.DefaultRequestHeaders.UserAgent.ParseAdd("SinalCollector/1.0 (+https://jornal.heliofilho.dev)");
var fetcher = new FeedFetcher(http);
var since = DateTimeOffset.UtcNow - lookback;

// 1. Coleta (uma fonte fora do ar não derruba as outras)
var fetched = await Task.WhenAll(NewsSources.All.Select(async source =>
{
    try
    {
        var items = await fetcher.FetchAsync(source, since, ct);
        Console.WriteLine($"[feed] {source.Name}: {items.Count}");
        return items;
    }
    catch (Exception ex) when (ex is not OperationCanceledException)
    {
        Console.Error.WriteLine($"[feed] {source.Name}: FALHOU — {ex.Message}");
        return [];
    }
}));

var raw = fetched.SelectMany(i => i).DistinctBy(i => i.Url).ToList();
Console.WriteLine($"[feed] total: {raw.Count} itens nas últimas {lookback.TotalHours}h");

if (dryRun)
{
    foreach (var item in raw.OrderByDescending(i => i.PublishedAt).Take(15))
        Console.WriteLine($"  {item.PublishedAt:dd/MM HH:mm} [{item.SourceName}] {item.Title}");

    // Prévia do "em alta" só com os títulos originais (no pipeline real entra também o título traduzido)
    var preview = raw.Select((item, i) => new TrendingDetector.Item(i, item.SourceName, item.Title)).ToList();
    var hot = TrendingDetector.Detect(preview).ToHashSet();
    Console.WriteLine($"[em alta] {hot.Count} itens:");
    foreach (var item in preview.Where(p => hot.Contains(p.Id)))
        Console.WriteLine($"  [{item.Source}] {item.Text}");
    return;
}

var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new InvalidOperationException("Defina DATABASE_URL (connection string do Supabase do SINAL).");
await using var db = NpgsqlDataSource.Create(NewsRepository.ToNpgsqlConnectionString(connectionString));
var repo = new NewsRepository(db);

// 2. Só classifica o que ainda não está no banco
var existing = await repo.GetExistingUrlsAsync(raw.Select(i => i.Url).ToList(), ct);
var fresh = raw.Where(i => !existing.Contains(i.Url)).ToList();
Console.WriteLine($"[dedupe] {fresh.Count} novos, {existing.Count} já no banco");

// 3. Classificação (ANTHROPIC_API_KEY via ambiente) com concorrência limitada
var classifier = new NewsClassifier(new AnthropicClient(), model);
using var gate = new SemaphoreSlim(4);
var saved = 0;

await Task.WhenAll(fresh.Select(async item =>
{
    await gate.WaitAsync(ct);
    try
    {
        var classification = await classifier.ClassifyAsync(item, ct);
        if (classification is null) return;
        await repo.InsertAsync(item, classification, ct);
        Interlocked.Increment(ref saved);
    }
    catch (Exception ex) when (ex is not OperationCanceledException)
    {
        // Item que falhou não é gravado e volta a ser tentado na próxima execução
        Console.Error.WriteLine($"[classificador] '{item.Title}' falhou: {Detail(ex)}");
    }
    finally
    {
        gate.Release();
    }
}));

// 4. "Em alta" considera a janela inteira, não só esta execução. Falha aqui não pode derrubar
// o processo (senão Railway reinicia o container em loop) — só o recálculo fica pra próxima.
var trending = 0;
try
{
    trending = await repo.RecomputeTrendingAsync(TimeSpan.FromHours(36), ct);
}
catch (Exception ex) when (ex is not OperationCanceledException)
{
    Console.Error.WriteLine($"[em alta] falhou: {ex.Message}");
}

// 5. Matéria completa: prioridade alta ou em alta, sempre a partir do texto real da fonte.
// Extração falha é normal (paywall, bloqueio) — nesse caso fica só o resumo curto, sem forçar texto raso.
var writer = new NewsWriter(new AnthropicClient(), writerModel);
var extractor = new ArticleExtractor(http);
List<NewsRepository.BodyCandidate> candidates = [];
try
{
    candidates = await repo.GetNeedsBodyAsync(lookback, ct);
}
catch (Exception ex) when (ex is not OperationCanceledException)
{
    Console.Error.WriteLine($"[matéria] busca de candidatas falhou: {ex.Message}");
}
using var writeGate = new SemaphoreSlim(3);
var written = 0;

await Task.WhenAll(candidates.Select(async c =>
{
    await writeGate.WaitAsync(ct);
    try
    {
        var extracted = await extractor.ExtractAsync(c.Url, ct);
        var body = extracted.Text is null ? null : await writer.WriteAsync(c.TitlePt, c.SummaryPt, c.Source, extracted.Text, ct);
        await repo.UpdateBodyAsync(c.Id, body ?? "", extracted.ImageUrl, ct);
        if (body is not null) Interlocked.Increment(ref written);
    }
    catch (Exception ex) when (ex is not OperationCanceledException)
    {
        // Não grava nada: tenta de novo na próxima execução (pode ser falha transitória)
        Console.Error.WriteLine($"[matéria] '{c.TitlePt}' falhou: {Detail(ex)}");
    }
    finally
    {
        writeGate.Release();
    }
}));

Console.WriteLine($"[fim] {saved}/{fresh.Count} gravados, {trending} em alta, {written}/{candidates.Count} matérias completas. " +
    $"Tokens classificador: {classifier.InputTokens} entrada ({classifier.CacheReadTokens} do cache), {classifier.OutputTokens} saída ({model}). " +
    $"Tokens matéria: {writer.InputTokens} entrada ({writer.CacheReadTokens} do cache), {writer.OutputTokens} saída ({writerModel}).");
