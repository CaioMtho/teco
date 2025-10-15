
namespace TecoApi.Models.Entities;

using System.ComponentModel.DataAnnotations;

public class Review
{
    public long Id { get; set; }
    public long OrderId { get; set; }
    public Order? Order { get; set; }

    public long ProviderId { get; set; }
    public Provider? Provider { get; set; }
    public long RequesterId { get; set; }
    public Requester? Requester { get; set; }
    public int Rating { get; set; }

    [MaxLength(500, ErrorMessage = "Comentário deve conter no máximo 500 caracteres")]
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}