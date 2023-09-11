using API.Models;

namespace API.Interfaces
{
    public interface IAuthenticationService
    {
        Task<User> GetUserFromTokenAsync(HttpContext httpContext);
    }
}
