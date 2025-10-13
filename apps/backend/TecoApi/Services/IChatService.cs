using TecoApi.Models.Entities;

namespace TecoApi.Services;

public interface IChatService
{
    Task<ChatMessage> SendMessageAsync(long requestId, long userId, string content);
    Task<ChatMessage> SendProposalAsync(long requestId, long providerId, decimal amount, string content);
    Task<List<ChatMessage>> GetChatHistoryAsync(long requestId);
}