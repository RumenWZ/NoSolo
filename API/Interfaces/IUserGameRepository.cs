using API.Models;

namespace API.Interfaces
{
    public interface IUserGameRepository
    {
        void Add(int userId, int gameId, string description);
        Task<IEnumerable<UserGame>> GetUserGameListByUserIdAsync(int userId);

        Task<UserGame> GetUserGameByIdAsync(int id);

        Task DeleteUserGameAsync(int Id);

        Task<UserGame> UpdateUserGame(int id, string description);

    }
}
