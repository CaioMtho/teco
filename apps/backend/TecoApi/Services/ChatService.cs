using Microsoft.EntityFrameworkCore;
using TecoApi.Data;
using TecoApi.Models.Entities;
using TecoApi.Services.Interfaces;

namespace TecoApi.Services
{
    public class ChatService(TecoContext context) : IChatService
    {
        private readonly TecoContext _context = context 
                                                ?? throw new ArgumentNullException(nameof(context));

        public async Task<ChatMessage> SendMessageAsync(long requestId, long userId, string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content não pode ser vazio.", nameof(content));

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new KeyNotFoundException("Usuário (sender) não foi encontrado.");

            var chatMessage = new ChatMessage
            {
                RequestId = requestId,
                SenderId = user.Id,
                Content = content.Trim(),
                SentAt = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();
            return chatMessage;
        }

        public async Task<ChatMessage> SendProposalAsync(long requestId, long providerId, decimal amount, string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content não pode ser vazio.", nameof(content));

            if (amount <= 0)
                throw new ArgumentException("Amount deve ser maior que zero.", nameof(amount));

            var user = await _context.Users
                .Include(u => u.Provider)
                .FirstOrDefaultAsync(u => u.Provider != null && u.Provider.Id == providerId)
                ?? throw new KeyNotFoundException("Usuário associado ao provider não encontrado.");

            var proposal = new Proposal
            {
                RequestId = requestId,
                ProviderId = providerId,
                Amount = amount,
                Message = content.Trim()
            };

            var chatMessage = new ChatMessage
            {
                RequestId = requestId,
                ProposalId = null,
                Content = content.Trim(),
                SentAt = DateTime.UtcNow,
                SenderId = user.Id
            };

            _context.Proposals.Add(proposal);
            await _context.SaveChangesAsync();

            chatMessage.ProposalId = proposal.Id;
            chatMessage.IsProposal = true;

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            return chatMessage;
        }

        public async Task<List<ChatMessage>> GetChatHistoryAsync(long requestId)
        {
            return await _context.ChatMessages
                .Where(m => m.RequestId == requestId)
                .Include(m => m.Sender)
                    .ThenInclude(u => u!.Provider)
                .Include(m => m.Sender)
                    .ThenInclude(u => u!.Requester)
                .Include(m => m.Proposal)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }
    }
}
