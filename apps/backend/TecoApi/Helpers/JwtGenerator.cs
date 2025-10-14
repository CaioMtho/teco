using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TecoApi.Models.Entities;

namespace TecoApi.Helpers;

public class JwtGenerator(IConfiguration config) : IJwtGenerator
{
    private readonly IConfiguration _config = config;

    public string GenerateToken(User user)
    {
        ArgumentNullException.ThrowIfNull(user);

        var keyStr = _config["Jwt:Key"]
                     ?? Environment.GetEnvironmentVariable("JWT_KEY")
                     ?? throw new InvalidOperationException("JWT_KEY não configurada.");

        var issuer = _config["Jwt:Issuer"]
                     ?? Environment.GetEnvironmentVariable("JWT_ISSUER")
                     ?? "teco-api";

        var audience = _config["Jwt:Audience"]
                       ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE")
                       ?? "teco-client";

        var keyBytes = Encoding.UTF8.GetBytes(keyStr);
        if (keyBytes.Length < 32)
            throw new InvalidOperationException("A chave JWT deve ter ao menos 32 bytes (256 bits).");

        var creds = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat,
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(5),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
