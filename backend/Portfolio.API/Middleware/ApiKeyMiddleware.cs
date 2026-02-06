using Microsoft.Extensions.Configuration;

namespace Portfolio.API.Middleware;

/// <summary>
/// Middleware para proteger endpoints de escrita (POST, PUT, DELETE) com API Key.
/// 
/// POR QUÊ middleware?
/// - Intercepta todas as requisições antes de chegar nos controllers
/// - Centraliza lógica de autenticação
/// - GET endpoints continuam públicos (frontend funciona)
/// 
/// COMO FUNCIONA:
/// - Endpoints GET: Públicos (não precisam de API Key)
/// - Endpoints POST/PUT/DELETE: Requerem header X-API-Key
/// - API Key é lida da variável de ambiente API_KEY ou appsettings.json
/// </summary>
public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private const string API_KEY_HEADER = "X-API-Key";
    private readonly ILogger<ApiKeyMiddleware> _logger;
    private readonly IConfiguration _configuration;

    public ApiKeyMiddleware(RequestDelegate next, ILogger<ApiKeyMiddleware> logger, IConfiguration configuration)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Endpoints GET são públicos (não precisam de API Key)
        // Isso permite que o frontend funcione normalmente
        // Também permite OPTIONS (CORS preflight)
        if (context.Request.Method == "GET" || context.Request.Method == "OPTIONS")
        {
            await _next(context);
            return;
        }

        // Log para debug - verificar se middleware está sendo executado
        _logger.LogInformation("ApiKeyMiddleware executando para {Method} {Path}", 
            context.Request.Method, 
            context.Request.Path);

        // Lê API Key ANTES de verificar header (prioridade: variável de ambiente > appsettings.json)
        var envApiKey = Environment.GetEnvironmentVariable("API_KEY");
        var configApiKey = _configuration["API_KEY"];
        var apiKey = envApiKey ?? configApiKey;
        
        // Debug: log para verificar se está lendo a API Key
        _logger.LogInformation("API Key check - Env: {HasEnv}, Config: {HasConfig}, Final: {HasFinal}, ConfigValue: {ConfigValue}", 
            !string.IsNullOrEmpty(envApiKey), 
            !string.IsNullOrEmpty(configApiKey),
            !string.IsNullOrEmpty(apiKey),
            configApiKey ?? "null");
        
        // Se não tiver API Key configurada, permite passar em Development (para facilitar testes)
        if (string.IsNullOrEmpty(apiKey))
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") 
                ?? _configuration["ASPNETCORE_ENVIRONMENT"] 
                ?? "Development";
            
            if (environment == "Production")
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { 
                    message = "API Key validation not configured. Contact administrator." 
                });
                return;
            }
            
            // Em desenvolvimento, permite passar sem API Key se não estiver configurada
            _logger.LogWarning("API_KEY not configured in Development. Allowing request without validation.");
            await _next(context);
            return;
        }

        // Se API Key está configurada, SEMPRE exige validação (mesmo em Development)
        if (!context.Request.Headers.TryGetValue(API_KEY_HEADER, out var extractedApiKey))
        {
            _logger.LogWarning("API Key missing for {Method} {Path}", 
                context.Request.Method, 
                context.Request.Path);
            
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { 
                message = "API Key missing. Add 'X-API-Key' header to your request." 
            });
            return;
        }
        
        _logger.LogDebug("API Key found. Validating request.");

        // Valida API Key
        if (!apiKey.Equals(extractedApiKey.ToString(), StringComparison.Ordinal))
        {
            _logger.LogWarning("Invalid API Key attempt for {Method} {Path}", 
                context.Request.Method, 
                context.Request.Path);
            
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { 
                message = "Invalid API Key" 
            });
            return;
        }

        // API Key válida, continua com a requisição
        await _next(context);
    }
}
