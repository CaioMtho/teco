namespace TecoApi.DTOs.User;

using TecoApi.Models.Enums;
using TecoApi.DTOs.Address;

public class UserDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public Role Role { get; set; }
    public AddressDto? PersonalAddress { get; set; }
}
