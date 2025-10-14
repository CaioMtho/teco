namespace TecoApi.Services;
using TecoApi.DTOs.Auth;
public interface IAuthService
{
    Task<AuthResponseDto> AuthenticateAsync(LoginRequestDto loginRequest);
}