using TecoApi.Models.Enums;

namespace TecoApi.Helpers;

public class RequestQueryParameters
{
    public long? RequesterId { get; set; }
    public string? Search { get; set; }
    public RequestStatus? Status { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public int? MinProposals { get; set; }
    public int? MaxProposals { get; set; }
    public string? OrderBy { get; set; } = "CreatedAt";
    public bool Desc { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}