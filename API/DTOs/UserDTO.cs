using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string ProfileImageUrl { get; set; } = String.Empty;
        public string DisplayName { get; set; } = String.Empty;
        public string DiscordUsername { get; set; } = String.Empty;
        public string Summary { get; set; } = String.Empty;
        public Boolean IsAdmin { get; set; }
    }
}
