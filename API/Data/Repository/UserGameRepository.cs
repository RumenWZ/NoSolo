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


        public async Task<UserGame> GetUserGameByIdAsync(int id)
        {
            var userGame = await dc.UserGames.FirstOrDefaultAsync(x => x.Id == id);
            return userGame;
        }

        public async Task<IEnumerable<UserGame>> GetUserGameListByUserIdAsync(int userId)
        {
            var userGameList = await dc.UserGames.Where(u => u.UserId == userId).ToListAsync();
            return userGameList;
        }

        public async Task<UserGame> UpdateUserGame(int id, string description)
        {
            var userGame = await dc.UserGames.FirstOrDefaultAsync(x => x.Id == id);
            if (userGame != null)
            {
                userGame.Description = description;
            }
            return userGame;
        }
    }
}
