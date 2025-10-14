using Microsoft.EntityFrameworkCore;
using TecoApi.Data;
using TecoApi.DTOs.User;
using TecoApi.Models.Entities;
using TecoApi.Models.Enums;
using TecoApi.Services.Interfaces;

namespace TecoApi.Services;

public class UserService(TecoContext context) : IUserService
{
    private readonly TecoContext _context = context;
    private readonly DbSet<User> _users = context.Users;

    public static UserDto ToDto(User user) =>
        new()
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            PersonalAddress = user.PersonalAddress != null ?
                AddressService.ToDto(user.PersonalAddress) : null
        };

    public async Task<UserDto> GetByIdAsync(long id)
    {
        var user = await _users
            .AsNoTracking()
            .Include(u => u.PersonalAddress)
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Usuário não encontrado");
        return ToDto(user);
    }

    public async Task<UserDto> GetByEmailAsync(string email)
    {
        var user = await _users
            .AsNoTracking()
            .Include(u => u.PersonalAddress)
            .FirstOrDefaultAsync(u => u.Email == email)
            ?? throw new KeyNotFoundException("Usuário não encontrado");
        return ToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto createUserDto)
    {
        var user = new User
        {
            Name = createUserDto.Name,
            CPF = createUserDto.CPF,
            CNPJ = createUserDto.CNPJ,
            Email = createUserDto.Email,
            Role = createUserDto.Role,
            Password = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password, workFactor: 12),
            PersonalAddress = createUserDto.PersonalAddress != null
                ? AddressService.FromDto(createUserDto.PersonalAddress)
                : null
        };

        _users.Add(user);

        if (user.Role == Role.REQUESTER)
        {
            var requester = new Requester { User = user };
            _context.Requesters.Add(requester);
        }
        else if (user.Role == Role.PROVIDER)
        {
            var provider = new Provider { User = user };
            _context.Providers.Add(provider);
        }

        await _context.SaveChangesAsync();

        return ToDto(user);
    }


    public async Task DeleteAsync(long id)
    {
        var user = await _users.FindAsync(id)
            ?? throw new KeyNotFoundException("Usuário não encontrado");
        _users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<UserDto> UpdateAsync(long id, UpdateUserDto dto)
    {
        var user = await _users
            .Include(u => u.PersonalAddress)
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Usuário não encontrado");

        if (!string.IsNullOrWhiteSpace(dto.Name)) user.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.CPF)) user.CPF = dto.CPF;
        if (!string.IsNullOrWhiteSpace(dto.CNPJ)) user.CNPJ = dto.CNPJ;
        if (dto.PersonalAddressId.HasValue)
        {
            user.PersonalAddressId = dto.PersonalAddressId;
        }
        else if (dto.PersonalAddress != null)
        {
            var addrDto = dto.PersonalAddress;
            if (addrDto.Id.HasValue)
            {
                var addr = user.PersonalAddress ?? await _context.Addresses.FindAsync(addrDto.Id.Value);
                if (addr == null) throw new KeyNotFoundException("Endereço não encontrado");

                if (!string.IsNullOrWhiteSpace(addrDto.Street)) addr.Street = addrDto.Street;
                user.PersonalAddress = addr;
                user.PersonalAddressId = addr.Id;
            }
            else
            {
                var newAddr = AddressService.FromDto(addrDto);
                _context.Addresses.Add(newAddr);
                user.PersonalAddress = newAddr;
            }
        }

        await _context.SaveChangesAsync();
        return ToDto(user);
    }
    
}