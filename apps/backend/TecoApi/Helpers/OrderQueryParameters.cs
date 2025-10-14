using TecoApi.Models.Enums;

namespace TecoApi.Helpers;

public class OrderQueryParameters
{
    public long? RequesterId { get; set; }
    public long? ProviderId { get; set; }
    public OrderStatus? Status { get; set; }
    public PaymentStatus? PaymentStatus { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public bool? ClientConfirmed { get; set; }

    public string? OrderBy { get; set; } = "CreatedAt";
    public bool Desc { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}