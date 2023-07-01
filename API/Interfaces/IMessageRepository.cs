using API.Models;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        void SendMessage(int senderId, int receiverId, string message);
        Task<IEnumerable<Message>> GetMessagesBetweenUsersAsync(int user1Id, int user2Id);

    }
}
