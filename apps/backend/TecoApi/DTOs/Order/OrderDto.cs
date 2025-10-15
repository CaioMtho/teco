using TecoApi.DTOs.Review;
using TecoApi.Models.Enums;

namespace TecoApi.DTOs.Order;

public class OrderDto
{
    public long Id { get; set; }
    public long ProposalId { get; set; }
    public OrderStatus Status { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public bool ClientConfirmed { get; set; }

    public ReviewDto? Review { get; set; }
}