namespace TecoApi.Models.Entities;

using System.ComponentModel.DataAnnotations;

public class Proposal
{
    public long Id { get; set; }
    public long RequestId { get; set; }
    public required Request Request { get; set; }

    public Order? Order { get; set; }
    public long ProviderId { get; set; }
    public required Provider Provider { get; set; }
    public decimal Amount { get; set; }

    [MaxLength(500, ErrorMessage = "Mensagem deve conter no máximo 500 caracteres")]
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}