using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecoApi.DTOs.Request;
using TecoApi.Helpers;
using TecoApi.Models.Enums;
using TecoApi.Services;
using TecoApi.Services.Interfaces;

namespace TecoApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class RequestController(IRequestService requestService) : ControllerBase
{
    private readonly IRequestService _requestService = requestService;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAsync(
        [FromQuery] long? requesterId,
        [FromQuery] string? search,
        [FromQuery] RequestStatus? status,
        [FromQuery] DateTime? createdAfter,
        [FromQuery] DateTime? createdBefore,
        [FromQuery] int? minProposals,
        [FromQuery] int? maxProposals,
        [FromQuery] string? orderBy,
        [FromQuery] bool desc = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new RequestQueryParameters
        {
            RequesterId = requesterId,
            Search = search,
            Status = status,
            CreatedAfter = createdAfter,
            CreatedBefore = createdBefore,
            MinProposals = minProposals,
            MaxProposals = maxProposals,
            OrderBy = orderBy ?? "CreatedAt",
            Desc = desc,
            Page = page,
            PageSize = pageSize
        };

        var result = await _requestService.GetAsync(query, cancellationToken);

        Response.Headers["X-Total-Count"] = result.TotalCount.ToString();
        Response.Headers["X-Page"] = result.Page.ToString();
        Response.Headers["X-Page-Size"] = result.PageSize.ToString();

        return Ok(result.Items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(long id)
    {
        var request = await _requestService.GetByIdAsync(id);

        return Ok(request);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateRequestDto createRequestDto)
    {
        var created = await _requestService.CreateAsync(createRequestDto);
        return Created($"/api/v1/request/{created.Id}", created);    
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateAsync(long id, [FromBody] UpdateRequestDto updateRequestDto)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null || long.Parse(userIdClaim) != id)
            return Forbid("Usuário não pode alterar requests de outro usuário");
        
        return Ok(await _requestService.UpdateAsync(id, updateRequestDto));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(long id)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null || long.Parse(userIdClaim) != id)
            return Forbid("Usuário não pode alterar requests de outro usuário");
        await _requestService.DeleteAsync(id);
        return NoContent();
    }

}
