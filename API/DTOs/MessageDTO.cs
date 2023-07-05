namespace API.DTOs
{
    public class MessageDTO
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public string User1DisplayName { get; set; }
        public string User1ProfilePictureUrl { get; set; }
        public int User2Id { get; set; }
        public string MessageString { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
