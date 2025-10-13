namespace TecoApi.Models.Utils;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public required string Message { get; set; }
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}