using TecoApi.Models.Enums;
namespace TecoApi.Models.Entities;

public class Request
{
    public long Id { get; set; }
    public long ClientId { get; set; }
    public required Requester Client { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public List<string> Photos { get; set; } = [];
    public RequestStatus Status { get; set; } = RequestStatus.OPEN;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public Address? Address { get; set; }
    public ICollection<Proposal> Proposals { get; set; } = [];
}