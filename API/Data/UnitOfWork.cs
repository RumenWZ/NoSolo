using API.Data.Repository;
using API.Interfaces;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext dc;

        public UnitOfWork(DataContext dc)
        {
            this.dc = dc;
        }

        public IUserRepository UserRepository => new UserRepository(dc);
        public IGameRepository GameRepository => new GameRepository(dc);
        public IUserGameRepository UserGameRepository => new UserGameRepository(dc);
        public IFriendsRepository FriendsRepository => new FriendsRepository(dc);

        public async Task<bool> SaveAsync()
        {
            return await dc.SaveChangesAsync() > 0;
        }
    }
}
