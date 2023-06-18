namespace API.Interfaces
{
    public interface IFriendsRepository
    {
        void SendFriendRequest(int senderId,  int receiverId);
    }
}
