using API.Models;

namespace API.Interfaces
{
    public interface IFriendsRepository
    {
        void SendFriendRequest(int senderId,  int receiverId);
        Task<IEnumerable<Friend>> GetUserIncomingFriendRequestsAsync(int userId);

    }
}
