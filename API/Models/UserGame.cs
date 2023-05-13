namespace API.Models
{
    public class UserGame
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int GameId { get; set; }
        public Game Game { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
