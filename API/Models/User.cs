using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public byte[] Password { get; set; }
        [Required]
        public byte[] PasswordKey { get; set; }
        [Required]
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string ProfileImageUrl { get; set; } = String.Empty;
        public string DisplayName { get; set; } = String.Empty;
        public string DiscordUsername { get; set; } = String.Empty;
        public string Summary { get; set; } = String.Empty;
        public Boolean IsAdmin { get; set; } = false;

    }
}
