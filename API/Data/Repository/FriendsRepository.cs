using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository
{
    public class FriendsRepository : IFriendsRepository
    {
        private readonly DataContext dc;

        public FriendsRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<Friend> GetFriendshipAsync(int user1Id, int user2Id)
        {
            var friendship = await dc.Friends.FirstOrDefaultAsync(x => (x.User1Id == user1Id && x.User2Id == user2Id)
            || (x.User1Id == user2Id && x.User2Id == user1Id));
            return friendship;
              
        }

        public async Task<IEnumerable<Friend>> GetUserIncomingFriendRequestsAsync(int userId)
        {
            var friendRequests = await dc.Friends.Where(f => f.User2Id == userId && f.Status == "pending").ToListAsync();

            return friendRequests;
        }

        public void SendFriendRequest(int senderId, int receiverId)
        {
            Friend friend = new Friend();
            friend.User1Id = senderId;
            friend.User2Id = receiverId;
            friend.Status = "pending";
            friend.RequestedOn = DateTime.Now;

            dc.Friends.Add(friend);
        }
    }
}
