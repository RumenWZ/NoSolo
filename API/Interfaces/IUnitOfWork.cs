namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IGameRepository GameRepository { get; }
        IUserGameRepository UserGameRepository { get; }
        IFriendsRepository FriendsRepository { get; }
        Task<bool> SaveAsync();
    }
}
