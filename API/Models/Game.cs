using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Game
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string ImageUrl { get; set; }
    }
}
