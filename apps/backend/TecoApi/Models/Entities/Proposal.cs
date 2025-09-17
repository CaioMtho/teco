namespace TecoApi.Models.Entities;

public class Proposal
{
    public int Id { get; set; }
    public long RequestId { get; set; }
    public required Request Request { get; set; }
    public long TechnicianId { get; set; }
    public required Provider Provider { get; set; }
    public float Amount { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}