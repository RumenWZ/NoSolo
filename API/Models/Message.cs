namespace API.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public User User1 { get; set; }
        public int User2Id { get; set; }
        public User User2 { get; set; }
        public string MessageString { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;

    }
}
