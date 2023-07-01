using API.Interfaces;
using API.Models;

namespace API.Data.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext dc;

        public MessageRepository(DataContext dc)
        {
            this.dc = dc;
        }
        public void SendMessage(int senderId, int receiverId, string message)
        {

            var newMessage = new Message
            {
                User1Id = senderId,
                User2Id = receiverId,
                MessageString = message,
                Timestamp = DateTime.UtcNow
            };

            dc.Messages.Add(newMessage);

        }
    }
}
