namespace API.DTOs
{
    public class FriendshipResponseDTO
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public int User2Id { get; set; }
        public string Status { get; set; } = String.Empty;
        public DateTime FriendsSince { get; set; }
        public DateTime RequestedOn { get; set; }

    }
}
