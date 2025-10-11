namespace TecoApi.DTOs.User;
using System.ComponentModel.DataAnnotations;
using TecoApi.DTOs.Address;
using TecoApi.Models.Enums;

public class CreateUserDto
{
    [EmailAddress, Required] 
    public required string Email { get; set; }
    [Required, MinLength(6)] 
    public required string Password { get; set; }
    [Required, MinLength(4)]
    public required string Name { get; set; }
    public string? CPF { get; set; }
    public string? CNPJ { get; set; }
    public AddressDto? PersonalAddressId { get; set; }
    public Role Role { get; set; }
}