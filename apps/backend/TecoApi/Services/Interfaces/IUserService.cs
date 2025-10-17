using TecoApi.DTOs.User;

namespace TecoApi.Services.Interfaces;

public interface IUserService
{
    Task<UserDto> GetByIdAsync(long id);
    Task<UserDto> GetByEmailAsync(string email);
    Task<UserDto> CreateAsync(CreateUserDto createUserDto);
    Task<UserDto> UpdateAsync(long id, UpdateUserDto dto);
    Task<UserDto> GetUserBySupabaseIdAsync(string supabaseId);
}