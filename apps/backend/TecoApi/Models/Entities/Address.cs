namespace TecoApi.Models.Entities;

public class Address
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public required string Street { get; set; }

    public required string Neighborhood { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }

    public required string PostalCode { get; set; }

}