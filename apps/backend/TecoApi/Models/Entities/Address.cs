using System.ComponentModel.DataAnnotations;

namespace TecoApi.Models.Entities;

public class Address
{
    public long Id { get; set; }

    [MaxLength(100, ErrorMessage = "Rua deve conter no máximo 100 caracteres")]
    public required string Street { get; set; }

    [MaxLength(10, ErrorMessage = "Número deve conter no máximo 10 caracteres")]
    public string? Number { get; set; }
    [MaxLength(100, ErrorMessage = "Complemento deve conter no máximo 100 caracteres")]
    public string? Complement { get; set; }
    [MaxLength(100, ErrorMessage = "Bairro deve conter no máximo 100 caracteres")]
    public required string Neighborhood { get; set; }
    [MaxLength(100, ErrorMessage = "Cidade deve conter no máximo 100 caracteres")]
    public required string City { get; set; }
    [MaxLength(100, ErrorMessage = "Estado deve conter no máximo 100 caracteres")]
    public required string State { get; set; }
    [StringLength(9, MinimumLength = 8, ErrorMessage = "CEP deve conter entre 8 e 9 caracteres")]
    public required string PostalCode { get; set; }

}