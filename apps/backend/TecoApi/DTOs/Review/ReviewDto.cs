namespace TecoApi.DTOs.Review;

public class ReviewDto
{
    public long Id { get; set; }
    public long OrderId { get; set; }
    public long ProviderId { get; set; }
    public long RequesterId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public string? ProviderName { get; set; }
    public string? RequesterName { get; set; }
}