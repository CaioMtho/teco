using TecoApi.Models.Enums;

namespace TecoApi.Models.Entities;

public class User
{
    public long Id { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Name { get; set; }
    public required Role Role { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Provider? Provider { get; set; }
    public Requester? Requester { get; set; }
}
