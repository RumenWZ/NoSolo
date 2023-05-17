namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IGameRepository GameRepository { get; }
        IUserGameRepository UserGameRepository { get; }
        Task<bool> SaveAsync();
    }
}
