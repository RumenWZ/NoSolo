using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserGameController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        public UserGameController(
            IUnitOfWork uow
            )
        {
            this.uow = uow;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add(UserGameAddRequest request)
        {
            var user = await uow.UserRepository.GetByIdAsync(request.UserId);
            if (user == null)
            {
                return BadRequest("User can not be found");
            }
            var game = await uow.GameRepository.GetByIdAsync(request.GameId);
            if (game == null)
            {
                return BadRequest("Game can not be found");
            }

            uow.UserGameRepository.Add(user.Id, game.Id, request.Description);
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpGet("get-user-games/{username}")]
        public async Task<IActionResult> GetUserGames(string username)
        {

            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                return BadRequest("User can not be found");
            }
            var userGameList = await uow.UserGameRepository.GetUserGameListByUserIdAsync(user.Id);
            var gameIds = userGameList.Select(ug => ug.GameId).ToList();
            var games = await uow.GameRepository.GetGamesByIds(gameIds);

            var userGameDTOs = new List<UserGameDTO>();

            foreach (var game in games)
            {
                var userGame = userGameList.FirstOrDefault(ug => ug.GameId == game.Id);
                var userGameDTO = new UserGameDTO
                {
                    UserGameId = userGame.Id,
                    GameId = game.Id,
                    GameName = game.Name,
                    GameImageUrl = game.ImageUrl,
                    UserDescription = userGame.Description,
                    AddedOn = userGame.AddedOn
                };
                userGameDTOs.Add(userGameDTO);
            }

            return Ok(userGameDTOs);
        }

        [HttpGet("get-user-game/{id}")]
        public async Task<IActionResult> GetUserGameDTO(int id)
        {

            var userGame = await uow.UserGameRepository.GetUserGameByIdAsync(id);
            if (userGame == null)
            {
                return BadRequest("User game not found");
            }

            var game = await uow.GameRepository.GetByIdAsync(userGame.GameId);
            if (game == null)
            {
                return BadRequest("Game not found");
            }

            var userGameDTO = new UserGameDTO
            {
                UserGameId = userGame.Id,
                GameId = game.Id,
                GameName = game.Name,
                GameImageUrl = game.ImageUrl,
                UserDescription = userGame.Description,
                AddedOn = userGame.AddedOn
            };

            return Ok(userGameDTO);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await uow.UserGameRepository.DeleteUserGameAsync(id);
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpPatch("update/{id}")]
        public async Task<IActionResult> Update(int id, string description)
        {
            if (description.IsNullOrEmpty())
            {
                throw new Exception("Description field can not be empty");
            }

            var userGame = await uow.UserGameRepository.GetUserGameByIdAsync(id);
            if (userGame == null)
            {
                throw new Exception("No user game with that id exists in the database.");
            }
            await uow.UserGameRepository.UpdateUserGame(id, description);
            await uow.SaveAsync();

            var game = await uow.GameRepository.GetByIdAsync(userGame.GameId);

            var userGameDTO = new UserGameDTO
            {
                UserGameId = userGame.Id,
                GameId = game.Id,
                GameName = game.Name,
                GameImageUrl = game.ImageUrl,
                UserDescription = userGame.Description,
                AddedOn = userGame.AddedOn
            };

            return Ok(userGameDTO);
        }

        public static UserGameDTO CreateUserGameDTO(Game game, UserGame userGame)
        {
            var userGameDTO = new UserGameDTO
            {
                UserGameId = userGame.Id,
                GameId = game.Id,
                GameName = game.Name,
                GameImageUrl = game.ImageUrl,
                UserDescription = userGame.Description,
                AddedOn = userGame.AddedOn
            };

            return userGameDTO;

        }
    }
}
