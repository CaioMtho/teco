using Microsoft.AspNetCore.Mvc;
using TecoApi.DTOs.Auth;
using TecoApi.Services;

namespace TecoApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
    {
        return Ok(_authService.AuthenticateAsync(loginRequestDto));
    }
    
}