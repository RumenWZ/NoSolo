using API.DTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IFriendsRepository
    {
        void SendFriendRequest(int senderId,  int receiverId);
        Task<IEnumerable<User>> GetUserIncomingFriendRequestsAsync(int userId);
        Task<IEnumerable<User>> GetAllFriendsOfUserAsync(int userId);
        Task<IEnumerable<User>> GetAllRequestedFriendshipsOfUserAsync(int userId);
        Task<IEnumerable<FriendshipResponseDTO>> GetAllFriendshipsOfUserAsync(int userId);
        Task<IEnumerable<FriendshipResponseDTO>> GetAllPendingAndAcceptedAsync(int userId);
        Task<Friend> GetFriendshipAsync(int user1Id, int user2Id);
        FriendshipResponseDTO CreateFriendshipDTO(Friend friendship);
        Task Delete(int friendId);
    }
}
