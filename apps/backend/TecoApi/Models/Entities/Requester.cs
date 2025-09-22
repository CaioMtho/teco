namespace TecoApi.Models.Entities;

public class Requester
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public required User User { get; set; }

    public ICollection<Order> Orders { get; set; } = [];

}