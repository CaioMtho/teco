using Microsoft.AspNetCore.Mvc;
using TecoApi.DTOs.User;
using TecoApi.Services;

namespace TecoApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UserController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpGet("{id}", Name = "GetUserById")]
    public async Task<IActionResult> GetByIdAsync(long id)
    {
        return Ok(await _userService.GetByIdAsync(id));
    }

    [HttpGet("by-email")]
    public async Task<IActionResult> GetByEmailAsync([FromQuery]string email)
    {
        return Ok(await _userService.GetByEmailAsync(email));
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserDto createUserDto)
    {
        var user = await _userService.CreateAsync(createUserDto);
        return CreatedAtRoute(
            "GetUserById", 
            new { id = user.Id }, 
            user
        );
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateAsync(long id, [FromBody] UpdateUserDto updateUserDto)
    {
        var user = await _userService.UpdateAsync(id, updateUserDto);
        return Ok(user);
    }
}