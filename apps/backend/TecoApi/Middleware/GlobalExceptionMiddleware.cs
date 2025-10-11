using System.Net;
using System.Text.Json;
using TecoApi.Models.Utils;

namespace TecoApi.Middleware;

public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger = logger;
    private readonly IHostEnvironment _env = env;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        _logger.LogError(ex, "Exceção Não-Tratada: {Message}", ex.Message);

        var (statusCode, message, details) = ex switch
        {
            ArgumentException argEx => (
                (int)HttpStatusCode.BadRequest,
                "Erro de validação nos dados fornecidos",
                _env.IsDevelopment() ? argEx.Message : null
            ),
            UnauthorizedAccessException _ => (
                (int)HttpStatusCode.Unauthorized,
                "Acesso negado",
                _env.IsDevelopment() ? ex.Message : null
            ),
            KeyNotFoundException argEx => (
                (int)HttpStatusCode.NotFound,
                "Recurso não encontrado",
                _env.IsDevelopment() ? argEx.Message : null
            ),
            _ => (
                (int)HttpStatusCode.InternalServerError,
                "Ocorreu um erro interno do servidor",
                _env.IsDevelopment() ? ex.Message + "\n" + ex.StackTrace : null
            )
        };

        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = message,
            Details = details
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }

}