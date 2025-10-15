using System.ComponentModel.DataAnnotations;
using TecoApi.DTOs.Address;

namespace TecoApi.DTOs.Request;

public class CreateRequestDto
{
    [Required]
    [StringLength(100, MinimumLength = 5)]
    public string Title { get; set; } = null!;

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = null!;

    public List<string>? Photos { get; set; }
    [Required]
    public long RequesterId { get; set; }

    public AddressDto? ServiceAddress { get; set; }
}