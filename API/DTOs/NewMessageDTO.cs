using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class NewMessageDTO
    {
        [Required]
        public string ReceiverUsername { get; set; }
        [Required]
        public string Message { get; set; } 
    }
}
