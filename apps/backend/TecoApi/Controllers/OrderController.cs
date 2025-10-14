using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecoApi.DTOs.Order;
using TecoApi.DTOs.Review;
using TecoApi.Helpers;
using TecoApi.Models.Enums;
using TecoApi.Services.Interfaces;

namespace TecoApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class OrderController(IOrderService orderService) : ControllerBase
{
    private readonly IOrderService _orderService = orderService
                                                  ?? throw new ArgumentNullException(nameof(orderService));


    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAsync(
        [FromQuery] long? requesterId,
        [FromQuery] long? providerId,
        [FromQuery] OrderStatus? status,
        [FromQuery] PaymentStatus? paymentStatus,
        [FromQuery] bool? clientConfirmed,
        [FromQuery] DateTime? createdAfter,
        [FromQuery] DateTime? createdBefore,
        [FromQuery] string? orderBy,
        [FromQuery] bool desc = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new OrderQueryParameters
        {
            RequesterId = requesterId,
            ProviderId = providerId,
            Status = status,
            PaymentStatus = paymentStatus,
            ClientConfirmed = clientConfirmed,
            CreatedAfter = createdAfter,
            CreatedBefore = createdBefore,
            OrderBy = orderBy ?? "CreatedAt",
            Desc = desc,
            Page = page,
            PageSize = pageSize
        };

        var result = await _orderService.GetAsync(query, cancellationToken);

        Response.Headers["X-Total-Count"] = result.TotalCount.ToString();
        Response.Headers["X-Page"] = result.Page.ToString();
        Response.Headers["X-Page-Size"] = result.PageSize.ToString();

        return Ok(result.Items);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(long id)
    {
        var order = await _orderService.GetByIdAsync(id);
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateOrderDto createOrderDto)
    {
        var created = await _orderService.CreateAsync(createOrderDto);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, created);
    }

    [HttpPost("{id}/review")]
    [Authorize(Roles = "ADMIN,REQUESTER")]
    public async Task<IActionResult> CreateReviewAsync(long id, [FromBody] CreateReviewDto dto)
    {
        var review = await _orderService.CreateReviewAsync(id, dto);
        return CreatedAtAction(nameof(CreateReviewAsync), new { id = review.Id }, review);
    }

    [HttpPost("{id}/complete")]
    [Authorize(Roles = "ADMIN,PROVIDER")]
    public async Task<IActionResult> CompleteOrder(long id)
    {
        await _orderService.CompleteOrderAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelOrder(long id)
    {
        await _orderService.CancelOrderAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/start")]
    [Authorize(Roles = "ADMIN,PROVIDER")]
    public async Task<IActionResult> StartOrder(long id)
    {
        await _orderService.StartOrderAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/confirm")]
    [Authorize(Roles = "ADMIN,REQUESTER")]
    public async Task<IActionResult> ConfirmOrder(long id)
    {
        await _orderService.ConfirmOrderAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/payment/hold")]
    [Authorize(Roles = "ADMIN,PROVIDER")]
    public async Task<IActionResult> HoldPayment(long id)
    {
        await _orderService.HoldPaymentAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/payment/release")]
    public async Task<IActionResult> ReleasePayment(long id)
    {
        await _orderService.ReleasePaymentAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/payment/refund")]
    [Authorize(Roles = "ADMIN,PROVIDER")]
    public async Task<IActionResult> RefundPayment(long id)
    {
        await _orderService.RefundPaymentAsync(id);
        return NoContent();
    }


}