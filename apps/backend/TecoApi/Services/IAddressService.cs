namespace TecoApi.Services;
using TecoApi.DTOs.Address;
public interface IAddressService
{
    Task<AddressDto> GetByIdAsync(long id);
}