using Microsoft.EntityFrameworkCore;
using TecoApi.Data;
using TecoApi.DTOs.Request;
using TecoApi.Helpers;
using TecoApi.Models.Entities;
using TecoApi.Services.Interfaces;

namespace TecoApi.Services;

public class RequestService(TecoContext context) : IRequestService
{
    private readonly TecoContext _context = context;
    private readonly DbSet<Request> _requests = context.Requests;

    public static RequestDto ToDto(Request request) => new RequestDto
    {
        Id = request.Id,
        Title = request.Title,
        Description = request.Description,
        Photos = request.Photos.ToList(),
        Status = request.Status.ToString(),
        RequesterId = request.RequesterId,
        RequesterName = request.Requester!.User!.Name,
        ServiceAddressId = request.ServiceAddressId,
        ServiceAddress = request.ServiceAddress != null 
            ? AddressService.ToDto(request.ServiceAddress) 
            : null,
        ProposalCount = request.Proposals.Count
    };

    public async Task<PaginatedResult<RequestDto>> GetAsync(RequestQueryParameters q, CancellationToken ct = default)
    {
        if (q.Page < 1) q.Page = 1;
        if (q.PageSize is < 1 or > 100) q.PageSize = 20;

        var query = _requests.AsQueryable();

        if (q.RequesterId.HasValue)
            query = query.Where(x => x.RequesterId == q.RequesterId.Value);

        if (q.Status.HasValue)
            query = query.Where(x => x.Status == q.Status.Value);

        if (!string.IsNullOrEmpty(q.Search))
        {
            var s = q.Search.Trim();
            query = query
                .Where(r => EF.Functions.ILike(r.Title, $"%{s}%") || EF.Functions.ILike(r.Description, $"%{s}%"));
        }
        
        if(q.CreatedAfter.HasValue)
            query = query.Where(x => x.CreatedAt >= q.CreatedAfter.Value);
        if(q.CreatedBefore.HasValue)
            query = query.Where(x => x.CreatedAt <= q.CreatedBefore.Value);
        
        if (q.CreatedAfter.HasValue)
            query = query.Where(r => r.CreatedAt >= q.CreatedAfter.Value);

        if (q.CreatedBefore.HasValue)
            query = query.Where(r => r.CreatedAt <= q.CreatedBefore.Value);

        var withProposals = query
            .Select(r => new
            {
                Request = r,
                ProposalsCount = r.Proposals.Count()
            });

        if (q.MinProposals.HasValue)
            withProposals = withProposals.Where(x => x.ProposalsCount >= q.MinProposals.Value);

        if (q.MaxProposals.HasValue)
            withProposals = withProposals.Where(x => x.ProposalsCount <= q.MaxProposals.Value);

        var desc = q.Desc;
        withProposals = q.OrderBy?.ToLowerInvariant() switch
        {
            "title" => desc ? withProposals.OrderByDescending(x => x.Request.Title) : withProposals.OrderBy(x => x.Request.Title),
            "createdat" => desc ? withProposals.OrderByDescending(x => x.Request.CreatedAt) : withProposals.OrderBy(x => x.Request.CreatedAt),
            "proposals" => desc ? withProposals.OrderByDescending(x => x.ProposalsCount) : withProposals.OrderBy(x => x.ProposalsCount),
            _ => desc ? withProposals.OrderByDescending(x => x.Request.CreatedAt) : withProposals.OrderBy(x => x.Request.CreatedAt)
        };

        var totalCount = await withProposals.CountAsync(ct);

        var skip = (q.Page - 1) * q.PageSize;
        var pageItems = await withProposals
            .Skip(skip)
            .Take(q.PageSize)
            .Select(x => new RequestDto
            {
                Id = x.Request.Id,
                RequesterId = x.Request.RequesterId,
                Title = x.Request.Title,
                Description = x.Request.Description,
                Photos = x.Request.Photos.ToList(),
                Status = x.Request.Status.ToString(),
                CreatedAt = x.Request.CreatedAt,
                ServiceAddressId = x.Request.ServiceAddressId,
                ProposalCount = x.ProposalsCount
            })
            .ToListAsync(ct);

        return new PaginatedResult<RequestDto>
        {
            Items = pageItems,
            TotalCount = totalCount,
            Page = q.Page,
            PageSize = q.PageSize
        };
    }

    public async Task<RequestDto> GetByIdAsync(long id)
    {
        var request = await _requests.FindAsync(id) 
                      ?? throw new KeyNotFoundException("Request não encontrado");
        return ToDto(request);
    }

    public async Task<RequestDto> CreateAsync(CreateRequestDto createRequestDto)
    {
        Address? serviceAddress = null;
        if (createRequestDto.ServiceAddress is not null)
        {
            serviceAddress = _context
                .Addresses
                .Add(AddressService.FromDto(createRequestDto.ServiceAddress))
                .Entity;
            await _context.SaveChangesAsync();
        }

        var request = new Request
        {
            Title = createRequestDto.Title,
            Description = createRequestDto.Description,
            Photos = createRequestDto.Photos ?? [],
            RequesterId = createRequestDto.RequesterId,
            ServiceAddress = serviceAddress,
            CreatedAt = DateTime.UtcNow,
        };
        
        _requests.Add(request);
        await _context.SaveChangesAsync();
        return ToDto(request);
    }

    public async Task DeleteAsync(long id)
    {
        var request = await _requests.FindAsync(id) 
                      ?? throw new KeyNotFoundException("Request não encontrada");
        _requests.Remove(request);
        await _context.SaveChangesAsync();
    }

    public async Task<RequestDto> UpdateAsync(long id, UpdateRequestDto updateRequestDto)
    {
        var request = await _requests.FindAsync(id) 
                      ?? throw new KeyNotFoundException("Request não encontrada");
        if (updateRequestDto.Title != null && updateRequestDto.Title != request.Title)
            request.Title = updateRequestDto.Title;
        if(updateRequestDto.Description != null && updateRequestDto.Description != request.Description)
            request.Description = updateRequestDto.Description;
        if(updateRequestDto.Photos != null &&  !Equals(updateRequestDto.Photos, request.Photos))
            request.Photos = updateRequestDto.Photos;
        if (updateRequestDto.ServiceAddressId  != null)
        {
            request.ServiceAddressId = updateRequestDto.ServiceAddressId;
        }
        else if (updateRequestDto.ServiceAddress != null)
        {
            var addrDto = updateRequestDto.ServiceAddress;
            if (addrDto.Id.HasValue)
            {
                var addr = updateRequestDto.ServiceAddress;
                if (addr == null) throw new KeyNotFoundException("Endereço não encontrado");

                if (!string.IsNullOrWhiteSpace(addrDto.Street)) addr.Street = addrDto.Street;
                updateRequestDto.ServiceAddress = addr;
                updateRequestDto.ServiceAddressId = addr.Id;
            }
            else
            {
                var newAddr = AddressService.FromDto(addrDto);
                _context.Addresses.Add(newAddr);
                request.ServiceAddress = newAddr;
            }
        }

        return ToDto(request);
    }

    public async Task<dynamic> GetRequestProposalCountAsync(long id)
    {
        var request = await _requests.FindAsync(id) 
                       ?? throw new KeyNotFoundException("Proposal não encontrada");
        var proposalCount = request.Proposals.Count;

        return new
        {
            request.Id,
            request.Description,
            request.CreatedAt,
            ProposalCount = proposalCount,
            Status = request.Status.ToString()
        };
    }

}