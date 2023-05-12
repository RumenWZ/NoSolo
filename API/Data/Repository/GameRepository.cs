using API.Interfaces;
using API.Models;

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

        public void Delete(int id)
        {
            var game = dc.Games.FirstOrDefault(x => x.Id == id);
            if (game != null)
            {
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
    }
}
