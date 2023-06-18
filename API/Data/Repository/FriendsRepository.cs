using API.Interfaces;
using API.Models;

namespace API.Data.Repository
{
    public class FriendsRepository : IFriendsRepository
    {
        private readonly DataContext dc;

        public FriendsRepository(DataContext dc)
        {
            this.dc = dc;
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
