using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TecoApi.Services.Interfaces;

namespace TecoApi.Hubs;

[Authorize]
public class ChatHub(IChatService chatService, ILogger<ChatHub> logger) : Hub
{
    private readonly IChatService _chatService = chatService;
    private readonly ILogger<ChatHub> _logger = logger;

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        _logger.LogInformation("User {UserId} se conectou", userId);
        await base.OnConnectedAsync();
    }
    
     public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _logger.LogInformation("User {userId} disconnected", userId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRequestChat(long requestId)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var groupName = $"Request_{requestId}";
            
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            _logger.LogInformation("User {userId} joined chat for Request {requestId}", userId, requestId);
            
            await Clients.OthersInGroup(groupName).SendAsync("UserJoined", userId);
        }

        public async Task LeaveRequestChat(long requestId)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var groupName = $"Request_{requestId}";
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            _logger.LogInformation("User {userId} left chat for Request {requestId}", userId, requestId);
            
            await Clients.OthersInGroup(groupName).SendAsync("UserLeft", userId);
        }

        public async Task SendMessage(long requestId, string content)
        {
            try
            {
                var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                {
                    throw new HubException("Usuário não autenticado");
                }

                var chatMessage = await _chatService.SendMessageAsync(requestId, userId, content);

                var groupName = $"Request_{requestId}";
                
                await Clients.Group(groupName).SendAsync("ReceiveMessage", new
                {
                    chatMessage.Id,
                    chatMessage.RequestId,
                    chatMessage.SenderId,
                    SenderName = chatMessage.Sender?.Name,
                    chatMessage.Content,
                    chatMessage.IsProposal,
                    chatMessage.ProposalId,
                    chatMessage.SentAt
                });

                _logger.LogInformation("Message sent by User {userId} in Request {requestId}", userId, requestId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro enviando message");
                throw new HubException("Erro ao enviar mensagem: " + ex.Message);
            }
        }

        public async Task SendProposal(long requestId, long providerId, decimal amount, string content)
        {
            try
            {
                var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                {
                    throw new HubException("Usuário {userId} não autenticado");
                }

                var chatMessage = await _chatService.SendProposalAsync(requestId, providerId, amount, content);

                var groupName = $"Request_{requestId}";
                
                await Clients.Group(groupName).SendAsync("ReceiveProposal", new
                {
                    chatMessage.Id,
                    chatMessage.RequestId,
                    chatMessage.SenderId,
                    SenderName = chatMessage.Sender?.Name,
                    chatMessage.Content,
                    chatMessage.IsProposal,
                    chatMessage.ProposalId,
                    ProposalAmount = chatMessage.Proposal?.Amount,
                    chatMessage.SentAt
                });

                _logger.LogInformation("Proposal sent by Provider {providerId} in Request {requestId}", providerId, requestId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro enviando proposal");
                throw new HubException("Erro ao enviar proposta: " + ex.Message);
            }
        }

        public async Task NotifyTyping(long requestId, bool isTyping)
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return;

            var groupName = $"Request_{requestId}";
            
            await Clients.OthersInGroup(groupName).SendAsync("UserTyping", new
            {
                UserId = userIdClaim,
                IsTyping = isTyping
            });
        }
}