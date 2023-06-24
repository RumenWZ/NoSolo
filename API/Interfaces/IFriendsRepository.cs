using API.DTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IFriendsRepository
    {
        void SendFriendRequest(int senderId,  int receiverId);
        Task<IEnumerable<Friend>> GetUserIncomingFriendRequestsAsync(int userId);
        Task<Friend> GetFriendshipAsync(int user1Id, int user2Id);
        FriendshipResponseDTO CreateFriendshipDTO(Friend friendship);
    }
}
