using API.Models;

namespace API.DTOs
{
    public class UserGameAddRequest
    {
        public int GameId { get; set; }
        public string Description { get; set; }
    }
}
