namespace TecoApi.DTOs.Address;
using System.ComponentModel.DataAnnotations;

public class AddressDto
{
    public long? Id { get; set; }
    [Required, MaxLength(100)] 
    public string Street { get; set; } = null!;
    [Required, MaxLength(10)] 
    public string? Number { get; set; }
    [MaxLength(100)] 
    public string? Complement { get; set; }
    [Required, MaxLength(100)] 
    public string Neighborhood { get; set; } = null!;
    [Required, MaxLength(100)]
     public string City { get; set; } = null!;
    [Required, MaxLength(100)] 
    public string State { get; set; } = null!;
    [Required, StringLength(9, MinimumLength = 8)] 
    public string PostalCode { get; set; } = null!;
}
