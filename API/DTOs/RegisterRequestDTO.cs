using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterRequestDTO
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Username is required")]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Username can only contain letters and numbers")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Username must be between 4 and 20 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(40, MinimumLength = 6, ErrorMessage = "Email Must be between 6 and 40 characters")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 30 characters")]
        public string Password { get; set; }


    }
}
