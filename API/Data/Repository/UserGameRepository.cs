using API.Interfaces;
using API.Migrations;
using API.Models;

namespace API.Data.Repository
{
    public class UserGameRepository : IUserGameRepository
    {
        private readonly DataContext dc;
        public UserGameRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public void Add(int userId, int gameId, string description)
        {
            UserGame userGame = new UserGame();
            userGame.UserId = userId;
            userGame.GameId = gameId;
            userGame.Description =  description;
            userGame.AddedOn = DateTime.Now;
            dc.UserGames.Add(userGame);
        }

    }
}
