using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TecoApi.DTOs.Auth;
using TecoApi.DTOs.User;
using TecoApi.Services.Interfaces;

namespace TecoApi.Controllers;


[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService, IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;
    private readonly IAuthService _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] CreateUserDto createUserDto)
    {
        var result = await _authService.RegisterAsync(createUserDto);
        return CreatedAtAction(nameof(GetCurrentUserAsync), null, result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequestDto loginRequestDto)
    {
        return Ok(await _authService.LoginAsync(loginRequestDto));
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        var authUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(authUserId))
        {
            return Unauthorized(new { message = "Token inválido" });
        }

        var user = await _userService.GetUserBySupabaseIdAsync(authUserId);
        return Ok(user);
    }
    

}