namespace TecoApi.Helpers;

using TecoApi.Models.Entities;

public interface IJwtGenerator
{
    string GenerateToken(User user);
}