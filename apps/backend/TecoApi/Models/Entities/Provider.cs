namespace TecoApi.Models.Entities;

public class Provider
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public required User User { get; set; }
    public string Bio { get; set; } = string.Empty;
    public ICollection<string> Skills { get; set; } = [];

    public long? WorkAddressId { get; set; }
    public Address? WorkAddress { get; set; }
    public float? PriceBase { get; set; }

    public ICollection<Order> Orders { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
}