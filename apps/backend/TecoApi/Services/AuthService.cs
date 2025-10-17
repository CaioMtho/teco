using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TecoApi.Data;
using TecoApi.DTOs.Auth;
using TecoApi.DTOs.User;
using TecoApi.Migrations;
using TecoApi.Models.Entities;
using TecoApi.Services.Interfaces;

namespace TecoApi.Services;

public class AuthService(TecoContext context, IHttpClientFactory httpClientFactory) : IAuthService
{
    private readonly TecoContext _context = context;
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
    private readonly string _supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL")
        ?? throw new InvalidOperationException("SUPABASE_URL não está definido");
    private readonly string _supabaseAnonKey = Environment.GetEnvironmentVariable("SUPABASE_ANON_KEY")
        ?? throw new InvalidOperationException("SUPABASE_ANON_KEY não está definido");

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto loginRequestDto)
    {
        var response = await LoginSupabaseUserAsync(loginRequestDto.Email, loginRequestDto.Password);

        if (response == null || string.IsNullOrEmpty(response.AuthUserId))
            throw new UnauthorizedAccessException("Credenciais inválidas.");

        var user = await _context.Users
            .Include(u => u.PersonalAddress)
            .FirstOrDefaultAsync(u => u.SupabaseId == Guid.Parse(response.AuthUserId))
            ?? throw new Exception("Credenciais inválidas");
            
        return new AuthResponseDto
        {
            AccessToken = response.AccessToken,
            RefreshToken = response.RefreshToken,
            ExpiresAt = response.ExpiresAt,
            User = UserService.ToDto(user)
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(CreateUserDto createUserDto)
    {
        var response = await CreateSupabaseUserAsync(createUserDto.Email, createUserDto.Password);

        if (response == null || string.IsNullOrEmpty(response.AuthUserId))
            throw new Exception("Falha ao criar usuário no Supabase.");

        var user = new User
        {
            SupabaseId = Guid.Parse(response.AuthUserId),
            Email = createUserDto.Email,
            Name = createUserDto.Name,
            CPF = createUserDto.CPF,
            CNPJ = createUserDto.CNPJ,
            CreatedAt = DateTime.UtcNow,
            Role = createUserDto.Role,
        };

        if (createUserDto.PersonalAddress != null)
        {
            user.PersonalAddress = AddressService.FromDto(createUserDto.PersonalAddress);
            _context.Addresses.Add(user.PersonalAddress);
            await _context.SaveChangesAsync();
            user.PersonalAddressId = user.PersonalAddress.Id;
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            AccessToken = response.AccessToken,
            RefreshToken = response.RefreshToken,
            ExpiresAt = response.ExpiresAt,
            User = UserService.ToDto(user)
        };

    }

    private async Task<SupabaseAuthResponse?> CreateSupabaseUserAsync(string email, string password)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", _supabaseAnonKey);

        var payload = new
        {
            email,
            password
        };

        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.PostAsync($"{_supabaseUrl}/auth/v1/signup", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Erro ao criar usuário no Supabase: {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<SupabaseAuthResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return result;
    }

    private async Task<SupabaseAuthResponse?> LoginSupabaseUserAsync(string email, string password)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", _supabaseAnonKey);

        var payload = new
        {
            email,
            password
        };

        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.PostAsync($"{_supabaseUrl}/auth/v1/token?grant_type=password", content);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<SupabaseAuthResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return result;
    }

    private class SupabaseAuthResponse
    {
        public string? Access_Token { get; set; }
        public string AccessToken => Access_Token ?? string.Empty;

        public string? Refresh_Token { get; set; }
        public string RefreshToken => Refresh_Token ?? string.Empty;
        public int? Expires_In { get; set; }
        public DateTime ExpiresAt => DateTime.UtcNow.AddSeconds(Expires_In ?? 3600);
        public SupabaseUser? User { get; set; }
        public string AuthUserId => User?.Id ?? string.Empty;
    }

    private class SupabaseUser
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
    }

}

