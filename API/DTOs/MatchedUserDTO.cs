namespace API.DTOs
{
    public class MatchedUserDTO
    {
        public UserDTO User { get; set; }
        public List<UserGameDTO> UserGames { get; set; }
    }
}
