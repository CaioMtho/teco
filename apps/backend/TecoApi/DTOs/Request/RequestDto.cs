using System.ComponentModel.DataAnnotations;
using TecoApi.DTOs.Address;
using TecoApi.Models.Enums;
namespace TecoApi.DTOs.Request;

public class RequestDto
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<string>? Photos { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public long RequesterId { get; set; }
    public string? RequesterName { get; set; }

    public long? ServiceAddressId { get; set; }
    public AddressDto? ServiceAddress { get; set; }

    public int ProposalCount { get; set; }
}