using TecoApi.DTOs.Auth;

namespace TecoApi.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> AuthenticateAsync(LoginRequestDto loginRequest);
}