namespace TecoApi.DTOs.Auth;

public class AuthResponseDto
{
    public required string Token { get; set; }
    public DateTime Expiration { get; set; }
}