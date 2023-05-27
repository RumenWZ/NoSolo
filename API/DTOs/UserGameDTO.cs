namespace API.DTOs
{
    public class UserGameDTO
    {
        public int UserGameId { get; set; }
        public int GameId { get; set; }
        public string GameName { get; set; }
        public string GameImageUrl { get; set; }
        public string UserDescription { get; set; }

    }
}
