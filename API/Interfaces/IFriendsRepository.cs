namespace API.Interfaces
{
    public interface IFriendsRepository
    {
        Task SendFriendRequest(string senderUsername,  string receiverUsername);
    }
}
