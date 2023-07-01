namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IGameRepository GameRepository { get; }
        IUserGameRepository UserGameRepository { get; }
        IFriendsRepository FriendsRepository { get; }
        IMessageRepository MessageRepository { get; }
        Task<bool> SaveAsync();
    }
}
