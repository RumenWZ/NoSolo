using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository
{
    public class GameRepository : IGameRepository
    {
        private readonly DataContext dc;

        public GameRepository(DataContext dc)
        {

            this.dc = dc;
            
        }
        public void Add(string name, string imageUrl)
        {
            Game game = new Game();
            game.Name = name;
            game.ImageUrl = imageUrl;

            dc.Games.Add(game);
        }

        public Task<IEnumerable<Game>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Game>>(dc.Games);
        }

        public async Task<Game> GetByIdAsync(int gameId)
        {
            var game = await dc.Games.FindAsync(gameId);
            return game;
        }

        public async Task<IEnumerable<Game>> GetGamesByIds(IEnumerable<int> ids)
        {
            var games = await dc.Games.Where(g => ids.Contains(g.Id)).ToListAsync();
            return games.ToList();
        }

        public async Task Delete(int id)
        {
            var game = await dc.Games.FirstOrDefaultAsync(x => x.Id == id);
            if (game != null)
            {
                dc.Games.Remove(game);
                await dc.SaveChangesAsync();
            }
            
        }

        public async Task<Game> GetByNameAsync(string name)
        {
            var game = await dc.Games.FirstOrDefaultAsync(g => g.Name == name);

            return game;
        }
    }
}
