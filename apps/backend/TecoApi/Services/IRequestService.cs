using TecoApi.DTOs.Request;
using TecoApi.Helpers;
using TecoApi.Models.Entities;

namespace TecoApi.Services;

public interface IRequestService
{
    Task<PaginatedResult<RequestDto>> GetAsync(RequestQueryParameters q, CancellationToken ct = default);
    Task<RequestDto> GetByIdAsync(long id);
    Task<RequestDto> CreateAsync(CreateRequestDto createRequestDto);
    Task DeleteAsync(long id);
    Task<RequestDto> UpdateAsync(long id, UpdateRequestDto updateRequestDto);
}