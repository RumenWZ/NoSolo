using API.Models;

namespace API.Interfaces
{
    public interface IUserGameRepository
    {
        void Add(int userId, int gameId, string description);
        Task<IEnumerable<UserGame>> GetUserGameListByIdAsync(int userId);

        Task<UserGame> GetUserGameByIdAsync(int userId);

    }
}
