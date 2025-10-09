using System.ComponentModel.DataAnnotations;
using TecoApi.Models.Enums;
namespace TecoApi.Models.Entities;

public class Request
{
    public long Id { get; set; }
    public long RequesterId { get; set; }
    public required Requester Requester { get; set; }

    [StringLength(100, MinimumLength = 5, ErrorMessage = "Título deve conter entre 5 e 100 caracteres")]
    public required string Title { get; set; }

    [StringLength(1000, MinimumLength = 10, ErrorMessage = "Descrição deve conter entre 10 e 1000 caracteres")]
    public required string Description { get; set; }
    public ICollection<string> Photos { get; set; } = [];
    public RequestStatus Status { get; set; } = RequestStatus.OPEN;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public long? ServiceAddressId { get; set; }
    public Address? ServiceAddress { get; set; }
    public ICollection<Proposal> Proposals { get; set; } = [];
}