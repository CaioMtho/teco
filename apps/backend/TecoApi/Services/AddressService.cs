namespace TecoApi.Services;

using TecoApi.Data;
using TecoApi.DTOs.Address;
using TecoApi.Models.Entities;

public class AddressService
{
    private readonly TecoContext _context;

    public AddressService(TecoContext context)
    {
        _context = context;
    }

    public static AddressDto ToDto(Address address) =>
        new()
        {
            Id = address.Id,
            Street = address.Street,
            City = address.City,
            State = address.State,
            Complement = address.Complement,
            Neighborhood = address.Neighborhood,
            Number = address.Number,
            PostalCode = address.PostalCode
        };

    public static Address FromDto(AddressDto addressDto) =>
        new()
        {
            Street = addressDto.Street,
            City = addressDto.City,
            State = addressDto.State,
            Complement = addressDto.Complement,
            Neighborhood = addressDto.Neighborhood,
            Number = addressDto.Number,
            PostalCode = addressDto.PostalCode
        };
}