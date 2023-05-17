using API.Models;

namespace API.Interfaces
{
    public interface IUserGameRepository
    {
        void Add(int userId, int gameId, string description);
        

    }
}
