using TecoApi.Models.Enums;
namespace TecoApi.Models.Entities;

public class Order
{
    public long Id { get; set; }
    public long ProposalId { get; set; }
    public Proposal? Proposal { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.PENDING;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.HELD;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public bool ClientConfirmed { get; set; } = false;

    public Review? Review { get; set; }
}