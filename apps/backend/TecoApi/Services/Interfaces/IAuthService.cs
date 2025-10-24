namespace TecoApi.Services.Interfaces;
using TecoApi.DTOs.Auth;
using TecoApi.DTOs.User;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(CreateUserDto dto);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
}
