using TecoApi.DTOs.Order;
using TecoApi.DTOs.Review;
using TecoApi.Helpers;

namespace TecoApi.Services.Interfaces;

public interface IOrderService
{
    Task<PaginatedResult<OrderDto>> GetAsync(OrderQueryParameters q, CancellationToken ct = default);
    Task<OrderDto> GetByIdAsync(long id);
    Task<OrderDto> CreateAsync(CreateOrderDto createOrderDto);
    Task<ReviewDto> CreateReviewAsync(long id, CreateReviewDto createReviewDto);

    Task CancelOrderAsync(long id);
    Task CompleteOrderAsync(long id);
    Task StartOrderAsync(long id);
    Task ConfirmOrderAsync(long id);

    Task HoldPaymentAsync(long id);
    Task ReleasePaymentAsync(long id);
    Task RefundPaymentAsync(long id);
}