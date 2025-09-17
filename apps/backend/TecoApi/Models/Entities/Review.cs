
namespace TecoApi.Models.Entities;

public class Review
{
    public long Id { get; set; }
    public long OrderId { get; set; }
    public required Order Order { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}