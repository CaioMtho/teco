using TecoApi.DTOs.Address;

namespace TecoApi.Services.Interfaces;

public interface IAddressService
{
    Task<AddressDto> GetByIdAsync(long id);
}