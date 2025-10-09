using TecoApi.Models.Enums;
namespace TecoApi.Models.Entities;

public class Request
{
    public long Id { get; set; }
    public long RequesterId { get; set; }
    public required Requester Requester { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public ICollection<string> Photos { get; set; } = [];
    public RequestStatus Status { get; set; } = RequestStatus.OPEN;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public long? ServiceAddressId { get; set; }
    public Address? ServiceAddress { get; set; }
    public ICollection<Proposal> Proposals { get; set; } = [];
}