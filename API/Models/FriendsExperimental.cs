using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class FriendsExperimental
    {
        public int Id { get; set; }
        [Required]
        public int User1Id { get; set; }
        public User User1 { get; set; }
        [Required]
        public int User2Id { get; set; }
        public User User2 { get; set; }
        public DateTimeOffset MatchedOn { get; set; }
    }
}
