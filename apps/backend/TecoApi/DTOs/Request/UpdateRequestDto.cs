using TecoApi.DTOs.Address;

namespace TecoApi.DTOs.Request;

using System.ComponentModel.DataAnnotations;
using TecoApi.Models.Enums;

public class UpdateRequestDto
{
    [StringLength(100, MinimumLength = 5)]
    public string? Title { get; set; }

    [StringLength(1000, MinimumLength = 10)]
    public string? Description { get; set; }

    public List<string>? Photos { get; set; }

    public RequestStatus? Status { get; set; }
    public long? ServiceAddressId { get; set; }

    public AddressDto? ServiceAddress { get; set; }
}