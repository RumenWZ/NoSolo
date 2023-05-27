using API.Interfaces;
using API.Migrations;
using API.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

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

        public async Task DeleteUserGame(int Id)
        {
            var userGame = await dc.UserGames.FirstOrDefaultAsync(x => x.Id == Id);
            if (userGame != null)
            {
                dc.UserGames.Remove(userGame);
            }
            else
            {
                // API error
            }
        }


        public async Task<UserGame> GetUserGameByGameIdAsync(int gameId)
        {
            var userGame = await dc.UserGames.FirstOrDefaultAsync(x => x.GameId == gameId);
            return userGame;
        }

        public async Task<IEnumerable<UserGame>> GetUserGameListByIdAsync(int userId)
        {
            var userGameList = await dc.UserGames.Where(u => u.UserId == userId).ToListAsync();
            return userGameList;
        }
    }
}
