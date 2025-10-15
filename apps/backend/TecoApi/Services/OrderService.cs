using Microsoft.EntityFrameworkCore;
using TecoApi.Data;
using TecoApi.DTOs.Order;
using TecoApi.DTOs.Review;
using TecoApi.Helpers;
using TecoApi.Models.Entities;
using TecoApi.Models.Enums;
using TecoApi.Services.Interfaces;

namespace TecoApi.Services;

public class OrderService(TecoContext context) : IOrderService
{
    private readonly TecoContext _context = context;
    private readonly DbSet<Order> _orders = context.Orders;

    public async Task<PaginatedResult<OrderDto>> GetAsync(OrderQueryParameters q, CancellationToken ct = default)
    {
        if (q.Page < 1) q.Page = 1;
        if (q.PageSize is < 1 or > 100) q.PageSize = 20;

        var query = _orders.AsQueryable();

        if (q.RequesterId.HasValue)
            query = query.Where(o => o.Proposal != null && o.Proposal.Request != null && o.Proposal.Request.RequesterId == q.RequesterId.Value);

        if (q.ProviderId.HasValue)
            query = query.Where(o => o.Proposal != null && o.Proposal.ProviderId == q.ProviderId.Value);

        if (q.Status.HasValue)
            query = query.Where(o => o.Status == q.Status.Value);

        if (q.PaymentStatus.HasValue)
            query = query.Where(o => o.PaymentStatus == q.PaymentStatus.Value);

        if (q.ClientConfirmed.HasValue)
            query = query.Where(o => o.ClientConfirmed == q.ClientConfirmed.Value);

        if (q.CreatedAfter.HasValue)
            query = query.Where(o => o.CreatedAt >= q.CreatedAfter.Value);

        if (q.CreatedBefore.HasValue)
            query = query.Where(o => o.CreatedAt <= q.CreatedBefore.Value);

        var desc = q.Desc;
        query = q.OrderBy?.ToLowerInvariant() switch
        {
            "createdat" => desc ? query.OrderByDescending(o => o.CreatedAt) : query.OrderBy(o => o.CreatedAt),
            "status" => desc ? query.OrderByDescending(o => o.Status) : query.OrderBy(o => o.Status),
            "paymentstatus" => desc ? query.OrderByDescending(o => o.PaymentStatus) : query.OrderBy(o => o.PaymentStatus),
            _ => desc ? query.OrderByDescending(o => o.CreatedAt) : query.OrderBy(o => o.CreatedAt)
        };

        var totalCount = await query.CountAsync(ct);
        var skip = (q.Page - 1) * q.PageSize;

        var pageItems = await query
            .Skip(skip)
            .Take(q.PageSize)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                ProposalId = o.ProposalId,
                Status = o.Status,
                PaymentStatus = o.PaymentStatus,
                CreatedAt = o.CreatedAt,
                StartedAt = o.StartedAt,
                FinishedAt = o.FinishedAt,
                ClientConfirmed = o.ClientConfirmed,
                Review = o.Review != null ? new ReviewDto
                {
                    Id = o.Review.Id,
                    Rating = o.Review.Rating,
                    Comment = o.Review.Comment,
                    CreatedAt = o.Review.CreatedAt
                } : null
            })
            .ToListAsync(ct);

        return new PaginatedResult<OrderDto>
        {
            Items = pageItems,
            TotalCount = totalCount,
            Page = q.Page,
            PageSize = q.PageSize
        };
    }

    public async Task<OrderDto> GetByIdAsync(long id)
    {
        var o = await _orders.FindAsync(id) 
                    ?? throw new KeyNotFoundException("Order não encontrada");
        
        return new OrderDto
        {
            Id = o.Id,
            ProposalId = o.ProposalId,
            Status = o.Status,
            PaymentStatus = o.PaymentStatus,
            CreatedAt = o.CreatedAt,
            StartedAt = o.StartedAt,
            FinishedAt = o.FinishedAt,
            ClientConfirmed = o.ClientConfirmed,
            Review = o.Review != null ? new ReviewDto
            {
                Id = o.Review.Id,
                Rating = o.Review.Rating,
                Comment = o.Review.Comment,
                CreatedAt = o.Review.CreatedAt
            }: null
        };
    }

    public async Task<OrderDto> CreateAsync(CreateOrderDto createOrderDto)
    {
        var order = new Order
        {
            ProposalId = createOrderDto.ProposalId,
            Status = OrderStatus.PENDING,
            CreatedAt = DateTime.UtcNow,
            PaymentStatus = PaymentStatus.HELD
        };
        
        _orders.Add(order);
        await _context.SaveChangesAsync();
        return new OrderDto
        {
            Id = order.Id,
            ProposalId = order.ProposalId,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            PaymentStatus = order.PaymentStatus,
        };
    }

    public async Task<ReviewDto> CreateReviewAsync(long id, CreateReviewDto createReviewDto)
    {
        var order = await _orders
                        .FindAsync(id) 
                    ?? throw new KeyNotFoundException("Order não encontrada");
        order.Review = new Review
        {
            OrderId = order.Id,
            ProviderId = createReviewDto.ProviderId,
            RequesterId = createReviewDto.RequesterId,
            Rating = createReviewDto.Rating,
            Comment = createReviewDto.Comment
        };
        var requesterUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Requester != null && u.Requester.Id == createReviewDto.RequesterId) 
            ?? throw new KeyNotFoundException("Requester não foi encontrado");

        var requesterName = requesterUser.Name;
        
        _context.Reviews.Add(order.Review);
        await _context.SaveChangesAsync();

        return new ReviewDto
        {
            Id = order.Review.Id,
            OrderId = order.Id,
            ProviderId = order.Review.ProviderId,
            RequesterId = order.Review.RequesterId,
            Rating = order.Review.Rating,
            Comment = order.Review.Comment,
            CreatedAt = order.Review.CreatedAt,
            RequesterName = requesterName
        };
    }

    public async Task CancelOrderAsync(long id)
    {
        var order = await _orders.FindAsync(id) 
                    ?? throw new KeyNotFoundException("Order não encontrada");
        order.Status = OrderStatus.CANCELLED;
        _orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task CompleteOrderAsync(long id)
    {
        var order  = await _orders.FindAsync(id) 
                     ??  throw new KeyNotFoundException("Order não encontrada");
        order.Status = OrderStatus.COMPLETED;
        order.FinishedAt =  DateTime.UtcNow;
        _orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task StartOrderAsync(long id)
    {
        var order  = await _orders.FindAsync(id) 
                     ??  throw new KeyNotFoundException("Order não encontrada");
        order.Status = OrderStatus.STARTING;
        order.StartedAt = DateTime.UtcNow;
        _orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task ConfirmOrderAsync(long id)
    {
        var order = await _orders.FindAsync(id) 
                    ?? throw new KeyNotFoundException("Order não encontrada");
        if (order.Status != OrderStatus.COMPLETED)
            throw new InvalidOperationException("Order não foi marcada como completa pelo provider");
        await ReleasePaymentAsync(id);
        order.ClientConfirmed = true;
        _orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task HoldPaymentAsync(long id)
    {
        var order = await _orders.FindAsync(id) 
                    ?? throw new KeyNotFoundException("Order não encontrada");
        order.PaymentStatus = PaymentStatus.HELD;
        _orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task ReleasePaymentAsync(long id)
    {
        var order = await _orders.FindAsync(id) 
                    ?? throw new KeyNotFoundException("Order não encontrada");
        order.PaymentStatus = PaymentStatus.RELEASED;
        _orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task RefundPaymentAsync(long id)
    {
        var order = await _orders.FindAsync(id) 
                    ?? throw new KeyNotFoundException("Order não encontrada");
        order.PaymentStatus = PaymentStatus.REFUND;
        _orders.Update(order);
        await _context.SaveChangesAsync();
    }
    
    

}