using System.ComponentModel.DataAnnotations;
using TecoApi.Models.Enums;

namespace TecoApi.Models.Entities;

public class User
{
    public long Id { get; set; }

    public Guid? SupabaseId { get; set; }
    
    [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve conter 11 dígitos")]
    public string? CPF { get; set; }

    [StringLength(14, MinimumLength = 14, ErrorMessage = "CNPJ deve conter 14 dígitos")]
    public string? CNPJ { get; set; }

    [EmailAddress(ErrorMessage = "Email em formato inválido")]
    public required string Email { get; set; }

    [MinLength(4, ErrorMessage = "Nome deve conter no mínimo 4 caracteres")]
    public required string Name { get; set; }

    public required Role Role { get; set; }

    public long? PersonalAddressId { get; set; }

    public Address? PersonalAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Provider? Provider { get; set; }
    public Requester? Requester { get; set; }
}
