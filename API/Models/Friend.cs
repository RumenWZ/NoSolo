namespace API.Models
{
    public class Friend
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public User User1 { get; set; }
        public int User2Id { get; set; }
        public User User2 { get; set; }
        public string Status { get; set; } = String.Empty;
        public DateTime FriendsSince { get; set; }
        public DateTime RequestedOn { get; set; }

    }
}
