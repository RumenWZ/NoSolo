namespace API.Interfaces
{
    public interface IGameRepository
    {
        void Add(string name, string imageUrl);
        void Delete(int id);
    }
}
