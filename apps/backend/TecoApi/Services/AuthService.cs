namespace TecoApi.Services;

using Microsoft.EntityFrameworkCore;
using TecoApi.Data;
using TecoApi.DTOs.Auth;
using TecoApi.Helpers;
using TecoApi.Models.Entities;

public class AuthService(TecoContext context, IJwtGenerator jwtGenerator) : IAuthService
{
    private readonly DbSet<User> _users = context.Users;
    private readonly IJwtGenerator _jwtGenerator = jwtGenerator;
    public async Task<AuthResponseDto> AuthenticateAsync(LoginRequestDto loginRequestDto)
    {
        var user = await _users.FirstOrDefaultAsync(u => u.Email == loginRequestDto.Email);
        if (user == null || BCrypt.Net.BCrypt.Verify(loginRequestDto.Password, user.Password))
        {
            throw new UnauthorizedAccessException("Credenciais inválidas");
        }

        var token = _jwtGenerator.GenerateToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddHours(5)
        };
    }
    
}