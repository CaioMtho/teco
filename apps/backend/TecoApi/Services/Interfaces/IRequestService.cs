using TecoApi.DTOs.Request;
using TecoApi.Helpers;

namespace TecoApi.Services.Interfaces;

public interface IRequestService
{
    Task<PaginatedResult<RequestDto>> GetAsync(RequestQueryParameters q, CancellationToken ct = default);
    Task<RequestDto> GetByIdAsync(long id);
    Task<RequestDto> CreateAsync(CreateRequestDto createRequestDto);
    Task DeleteAsync(long id);
    Task<RequestDto> UpdateAsync(long id, UpdateRequestDto updateRequestDto);
}