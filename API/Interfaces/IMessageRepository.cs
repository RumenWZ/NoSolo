namespace API.Interfaces
{
    public interface IMessageRepository
    {
        void SendMessage(int senderId, int receiverId, string message);
    }
}
