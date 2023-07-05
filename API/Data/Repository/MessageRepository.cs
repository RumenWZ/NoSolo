using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext dc;

        public MessageRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<IEnumerable<Message>> GetMessagesBetweenUsersAsync(int user1Id, int user2Id)
        {
            var messages = await dc.Messages.Where(m => (m.User1Id == user1Id && m.User2Id == user2Id)
            || (m.User2Id == user1Id && m.User1Id == user2Id)).ToListAsync();

            return messages;
        }

        public Message SendMessage(int senderId, int receiverId, string message)
        {

            var newMessage = new Message
            {
                User1Id = senderId,
                User2Id = receiverId,
                MessageString = message,
                Timestamp = DateTime.Now
            };

            dc.Messages.Add(newMessage);

            return newMessage;

        }
    }
}
