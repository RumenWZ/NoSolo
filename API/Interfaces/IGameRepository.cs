using API.Models;

namespace API.Interfaces
{
    public interface IGameRepository
    {
        void Add(string name, string imageUrl);
        void Delete(int id);
        Task<IEnumerable<Game>> GetAllAsync();
        Task<Game> GetByIdAsync(int gameId);
    }
}
