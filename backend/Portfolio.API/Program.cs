using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Services;
using Portfolio.Infrastructure.Data;
using Portfolio.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ========== CONFIGURAÇÃO DO BANCO DE DADOS ==========
// 
// POR QUÊ aqui no Program.cs?
// - Program.cs é o ponto de entrada da aplicação
// - É onde configuramos serviços (Dependency Injection)
// - É onde lemos configurações (appsettings.json, variáveis de ambiente)
//
// COMO FUNCIONA?
// 1. Lê connection string de variável de ambiente ou appsettings.json
// 2. Registra DbContext no DI Container
// 3. Configura para usar PostgreSQL (Supabase)

// Lê connection string
// ORDEM DE PRIORIDADE:
// 1. Variável de ambiente (mais segura, para produção)
//    Formato: ConnectionStrings__DefaultConnection (padrão .NET) ou DATABASE_CONNECTION_STRING
// 2. appsettings.Development.json (sobrescreve appsettings.json em dev)
// 3. appsettings.json (para desenvolvimento local)
var rawConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' not found. " +
        "Configure em appsettings.json ou variável de ambiente DATABASE_CONNECTION_STRING ou ConnectionStrings__DefaultConnection.");

// Converte formato URI (postgresql://...) para formato Parameters (key=value) se necessário
// Npgsql funciona melhor com formato Parameters
string connectionString;
if (rawConnectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) ||
    rawConnectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
{
    // Parse URI format para Parameters format
    try
    {
        var uri = new Uri(rawConnectionString);
        var connectionStringBuilder = new System.Text.StringBuilder();
        connectionStringBuilder.Append($"Host={uri.Host};");
        if (uri.Port > 0)
            connectionStringBuilder.Append($"Port={uri.Port};");
        connectionStringBuilder.Append($"Database={uri.LocalPath.TrimStart('/')};");
        if (!string.IsNullOrEmpty(uri.UserInfo))
        {
            var userInfo = uri.UserInfo.Split(':');
            if (userInfo.Length >= 1)
                connectionStringBuilder.Append($"Username={Uri.UnescapeDataString(userInfo[0])};");
            if (userInfo.Length >= 2)
                connectionStringBuilder.Append($"Password={Uri.UnescapeDataString(userInfo[1])};");
        }
        connectionStringBuilder.Append("SSL Mode=Require;Trust Server Certificate=true;");
        connectionString = connectionStringBuilder.ToString();
        Console.WriteLine("[DEBUG] Connection String convertida de URI para Parameters format");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DEBUG] Erro ao converter URI: {ex.Message}");
        // Se falhar, usa a string original
        connectionString = rawConnectionString;
    }
}
else
{
    // Já está no formato Parameters, usa direto
    connectionString = rawConnectionString;
}

// Log para debug (mostra apenas início da connection string por segurança)
Console.WriteLine("[DEBUG] ========== CONNECTION STRING DEBUG ==========");
if (!string.IsNullOrEmpty(connectionString))
{
    var preview = connectionString.Length > 50 
        ? connectionString.Substring(0, 50) + "..." 
        : connectionString;
    Console.WriteLine($"[DEBUG] Connection String final: {preview}");
    Console.WriteLine($"[DEBUG] Connection String começa com: {connectionString.Substring(0, Math.Min(20, connectionString.Length))}");
    Console.WriteLine($"[DEBUG] Connection String contém 'localhost': {connectionString.Contains("localhost")}");
    Console.WriteLine($"[DEBUG] Connection String contém 'pooler.supabase.com': {connectionString.Contains("pooler.supabase.com")}");
}
else
{
    Console.WriteLine("[DEBUG] Connection String está NULL ou vazia!");
}
Console.WriteLine("[DEBUG] ================================================");

// Registra DbContext no DI Container
// POR QUÊ AddDbContext?
// - Registra PortfolioDbContext como serviço
// - Gerencia ciclo de vida (cria/destrói automaticamente)
// - Configura para usar PostgreSQL
//
// SCOPE: Scoped = uma instância por requisição HTTP
// - Cada requisição tem seu próprio DbContext
// - Evita problemas de concorrência
// - Mais eficiente que Singleton (não compartilha estado)
builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(connectionString));

// ========== REGISTRO DE REPOSITORIES ==========
//
// POR QUÊ registrar aqui?
// - DI Container precisa saber qual implementação usar
// - Quando Controller pede IProjectRepository, DI injeta ProjectRepository
//
// SCOPE: Scoped (mesmo do DbContext)
// - Repository depende de DbContext
// - Ambos devem ter mesmo ciclo de vida
// - Uma instância por requisição HTTP
//
// PATTERN: Dependency Injection
// - Controller pede interface (IProjectRepository)
// - DI Container fornece implementação (ProjectRepository)
// - Facilita testes (pode mockar interface)
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ISkillRepository, SkillRepository>();
builder.Services.AddScoped<IExperienceRepository, ExperienceRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();

// ========== REGISTRO DE SERVICES ==========
//
// POR QUÊ registrar Services?
// - DI Container precisa saber qual implementação usar
// - Quando Controller pede IProjectService, DI injeta ProjectService
//
// SCOPE: Scoped (mesmo dos Repositories)
// - Service depende de Repository
// - Ambos devem ter mesmo ciclo de vida
// - Uma instância por requisição HTTP
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ISkillService, SkillService>();
builder.Services.AddScoped<IExperienceService, ExperienceService>();
builder.Services.AddScoped<IProfileService, ProfileService>();

// ========== CONFIGURAÇÃO DE SERVIÇOS ==========

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configura JSON para usar camelCase (padrão do JavaScript/TypeScript)
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Portfolio API",
        Version = "v1",
        Description = "API RESTful para gerenciar portfólio técnico (Projects, Skills, Experiences)",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Helio Filho",
            Email = "contact@heliofilho.dev"
        }
    });
    
    // Inclui comentários XML na documentação
    // POR QUÊ?
    // - Documentação automática dos endpoints
    // - Facilita para desenvolvedores consumirem a API
    // - Swagger UI mostra descrições dos métodos
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// ========== CONFIGURAÇÃO DE CORS ==========
// POR QUÊ CORS?
// - Frontend (Next.js) roda em localhost:3000 (dev) ou Vercel (prod)
// - Backend roda em localhost:5115 (dev) ou Railway (prod)
// - Browsers bloqueiam requisições cross-origin por segurança
// - CORS permite que frontend acesse backend
//
// EM PRODUÇÃO:
// - Aceita qualquer origem (para facilitar deploy)
// - Em produção real, especificar domínios exatos via variável de ambiente
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
if (allowedOrigins == null || allowedOrigins.Length == 0)
{
    // Se não configurado, permite qualquer origem (OK para portfólio pessoal)
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });
}
else
{
    // Se configurado via variável de ambiente, usa origens específicas
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });
}

var app = builder.Build();

// ========== CONFIGURAÇÃO DO PIPELINE HTTP ==========

// Configure the HTTP request pipeline.
// Swagger habilitado em produção para facilitar testes (portfólio pessoal)
app.UseSwagger();
app.UseSwaggerUI();

// HTTPS redirection apenas em desenvolvimento local
// Railway gerencia HTTPS automaticamente
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// CORS deve vir ANTES de UseAuthorization
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Railway injeta PORT via variável de ambiente
// Se não estiver definida, usa porta padrão (desenvolvimento)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5115";
var url = $"http://0.0.0.0:{port}";
app.Run(url);
