using System.ComponentModel.DataAnnotations;

namespace TecoApi.Models.Entities;

public class ChatMessage
{
    public long Id { get; set; }
    public long RequestId { get; set; }
    public required Request Request { get; set; }
    public long SenderId { get; set; }
    public required User Sender { get; set; }

    [MaxLength(100, ErrorMessage = "Mensagem deve conter no máximo 100 caracteres")]
    public string Content { get; set; } = string.Empty;

    public bool IsProposal { get; set; } = false;
    public long? ProposalId { get; set; }
    public Proposal? Proposal { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}