using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class UserGame
    {
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        [Required]
        public int GameId { get; set; }
        public Game Game { get; set; }
        [Required]
        public string Description { get; set; } = string.Empty;
        public DateTime AddedOn { get; set; } = DateTime.Now;
    }
}
