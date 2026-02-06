using Microsoft.AspNetCore.Mvc;

namespace Portfolio.API.Controllers;

/// <summary>
/// Controller para servir arquivos de currículo (Resume/CV).
/// 
/// POR QUÊ Controller separado?
/// - Responsabilidade única (servir arquivos estáticos)
/// - Facilita manutenção
/// - Pode adicionar lógica de autenticação/autorização no futuro
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ResumeController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ResumeController> _logger;

    public ResumeController(IWebHostEnvironment environment, ILogger<ResumeController> logger)
    {
        _environment = environment ?? throw new ArgumentNullException(nameof(environment));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Baixa o currículo em inglês (Resume).
    /// 
    /// GET /api/resume/en
    /// </summary>
    [HttpGet("en")]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DownloadResumeEn()
    {
        return DownloadResume("resume-en.pdf", "Helio_Filho_Resume.pdf");
    }

    /// <summary>
    /// Baixa o currículo em português (CV).
    /// 
    /// GET /api/resume/pt
    /// </summary>
    [HttpGet("pt")]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DownloadResumePt()
    {
        return DownloadResume("resume-pt.pdf", "Helio_Filho_CV.pdf");
    }

    /// <summary>
    /// Faz upload/substituição do currículo em inglês (Resume).
    /// 
    /// POST /api/resume/en
    /// Content-Type: multipart/form-data
    /// Campo: file (PDF)
    /// </summary>
    [HttpPost("en")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> UploadResumeEn([FromForm(Name = "file")] IFormFile file)
    {
        return await UploadResumeAsync(file, "resume-en.pdf");
    }

    /// <summary>
    /// Faz upload/substituição do currículo em português (CV).
    /// 
    /// POST /api/resume/pt
    /// Content-Type: multipart/form-data
    /// Campo: file (PDF)
    /// </summary>
    [HttpPost("pt")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> UploadResumePt([FromForm(Name = "file")] IFormFile file)
    {
        return await UploadResumeAsync(file, "resume-pt.pdf");
    }

    /// <summary>
    /// Método privado para servir arquivo PDF.
    /// </summary>
    private IActionResult DownloadResume(string fileName, string downloadFileName)
    {
        // Caminho do arquivo na pasta StaticFiles/Resumes
        var filePath = Path.Combine(_environment.ContentRootPath, "StaticFiles", "Resumes", fileName);

        if (!System.IO.File.Exists(filePath))
        {
            _logger.LogWarning("Resume file not found: {FilePath}", filePath);
            return NotFound(new { message = $"Resume file '{fileName}' not found. Please ensure the file exists in StaticFiles/Resumes/ folder." });
        }

        // Lê o arquivo e retorna como download
        var fileBytes = System.IO.File.ReadAllBytes(filePath);
        return File(fileBytes, "application/pdf", downloadFileName);
    }

    /// <summary>
    /// Salva o arquivo de currículo na pasta StaticFiles/Resumes,
    /// sobrescrevendo o arquivo existente.
    /// </summary>
    private async Task<IActionResult> UploadResumeAsync(IFormFile file, string targetFileName)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Nenhum arquivo enviado." });
        }

        if (!string.Equals(file.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Tentativa de upload com content-type inválido: {ContentType}", file.ContentType);
            return BadRequest(new { message = "Apenas arquivos PDF são permitidos." });
        }

        try
        {
            var directoryPath = Path.Combine(_environment.ContentRootPath, "StaticFiles", "Resumes");
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, targetFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            _logger.LogInformation("Resume file uploaded successfully: {FilePath}", filePath);
            return Ok(new { message = "Currículo enviado com sucesso." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao salvar arquivo de currículo.");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Erro ao salvar arquivo de currículo.", error = ex.Message });
        }
    }
}
