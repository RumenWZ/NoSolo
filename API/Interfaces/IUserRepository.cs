using API.DTOs;
using API.Models;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        Task<User> Authenticate (string username, string password);
        void Register(string username,string email, string password);
        Task<bool> UserAlreadyExists(string username);
        Task<User> GetByIdAsync(int userId);
        Task<User> GetByUserNameAsync(string username);
        Task<User> GetUserByTokenAsync(string token);
        Task<List<User>> GetAllUsersAsync();
        Task<IEnumerable<User>> FindUsers(string searchString);
        UserDTO CreateUserDTO(User User);
    }   
}
