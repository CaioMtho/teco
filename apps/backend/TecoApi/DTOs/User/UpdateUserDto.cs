namespace TecoApi.DTOs.User;
using TecoApi.DTOs.Address;
public class UpdateUserDto
{
    public string? Name { get; set; }
    public string? CPF { get; set; }
    public string? CNPJ { get; set; }
    public AddressDto? PersonalAddress { get; set; }
    public long? PersonalAddressId { get; set; }
}
