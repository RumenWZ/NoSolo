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

        public async void Delete(int id)
        {
            var game = dc.Games.FirstOrDefault(x => x.Id == id);
            if (game != null)
            {
                //await photoService.DeletePhotoAsync(game.ImageUrl);
                dc.Games.Remove(game);
            } else
            {
                // add API error here later
            }
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
    }
}
