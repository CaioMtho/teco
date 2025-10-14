using System.ComponentModel.DataAnnotations;

namespace TecoApi.DTOs.Review;

public class CreateReviewDto
{
    [Required]
    public long OrderId { get; set; }

    [Required]
    public long ProviderId { get; set; }

    [Required]
    public long RequesterId { get; set; }

    [Range(1, 5, ErrorMessage = "A nota deve estar entre 1 e 5")]
    public int Rating { get; set; }

    [MaxLength(500, ErrorMessage = "Comentário deve conter no máximo 500 caracteres")]
    public string Comment { get; set; } = string.Empty;
}
