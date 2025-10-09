namespace TecoApi.Models.Entities;

public class Proposal
{
    public long Id { get; set; }
    public long RequestId { get; set; }
    public required Request Request { get; set; }

    public Order? Order { get; set; }
    public long ProviderId { get; set; }
    public required Provider Provider { get; set; }
    public decimal Amount { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}