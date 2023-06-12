using API.Models;

namespace API.Interfaces
{
    public interface IGameRepository
    {
        void Add(string name, string imageUrl);
        Task Delete(int id);
        Task<IEnumerable<Game>> GetAllAsync();
        Task<Game> GetByIdAsync(int gameId);
        Task<IEnumerable<Game>> GetGamesByIds(IEnumerable<int> ids);
    }
}
