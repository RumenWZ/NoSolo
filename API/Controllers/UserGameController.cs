using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserGameController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        private readonly IAuthenticationService auth;

        public UserGameController(
            IUnitOfWork uow,
            IMapper mapper,
            IAuthenticationService auth
            )
        {
            this.uow = uow;
            this.mapper = mapper;
            this.auth = auth;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add(UserGameAddRequest request)
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
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

        [HttpGet("get-user-games-for-matching/{username}")]
        public async Task<IActionResult> GetUserGamesForMatching(string username)
        {
            var user1 = await auth.GetUserFromTokenAsync(HttpContext);
            if (user1 == null)
            {
                return BadRequest("Invalid token");
            }
            var user2 = await uow.UserRepository.GetByUserNameAsync(username);
            if (user2 == null)
            {
                return BadRequest("User 2 doesn't exist");
            }
            var user1UserGameList = await uow.UserGameRepository.GetUserGameListByUserIdAsync(user1.Id);
            var user1GameIds = user1UserGameList.Select(ug => ug.GameId).ToList();
            var user1Games = await uow.GameRepository.GetGamesByIds(user1GameIds);

            var user2UserGameList = await uow.UserGameRepository.GetUserGameListByUserIdAsync(user2.Id);
            var user2GameIds = user2UserGameList.Select(ug => ug.GameId).ToList();
            var user2Games = await uow.GameRepository.GetGamesByIds(user2GameIds);

            var user2UserGameDTOs = new List<UserGameDTO>();

            foreach (var game in user2Games)
            {
                var userGame = user2UserGameList.FirstOrDefault(ug => ug.GameId == game.Id);
                var userGameDTO = new UserGameDTO
                {
                    UserGameId = userGame.Id,
                    GameId = game.Id,
                    GameName = game.Name,
                    GameImageUrl = game.ImageUrl,
                    UserDescription = userGame.Description,
                    AddedOn = userGame.AddedOn
                };
                if (user1Games.Contains(game)) {
                    userGameDTO.isMatching = true;
                }
                user2UserGameDTOs.Add(userGameDTO);
            }

            return Ok(user2UserGameDTOs);
        }

        [HttpGet("get-matches")]
        public async Task<IActionResult> GetMatches()
        {
            var loggedInUser = await auth.GetUserFromTokenAsync(HttpContext);
            if (loggedInUser == null)
            {
                return BadRequest("Invalid token");
            }

            var friendsOfLoggedInUser = await uow.FriendsRepository.GetAllPendingAndAcceptedAsync(loggedInUser.Id);

            var loggedInUserGames = await uow.UserGameRepository.GetUserGameListByUserIdAsync(loggedInUser.Id);
            var loggedInUserGameIds = loggedInUserGames.Select(ug => ug.GameId).ToList();

            var matchedUsers = new List<MatchedUserDTO>();

            var allUsers = await uow.UserRepository.GetAllUsersAsync();

            foreach (var user in allUsers)
            {
                if (user.Id != loggedInUser.Id)
                {
                    var isAlreadyFriend = friendsOfLoggedInUser.Any(friend => friend.User1Id == user.Id || friend.User2Id == user.Id);
                    if (!isAlreadyFriend)
                    {
                        var userGames = await uow.UserGameRepository.GetUserGameListByUserIdAsync(user.Id);
                        var matchingGames = userGames.Where(ug => loggedInUserGameIds.Contains(ug.GameId)).ToList();

                        if (matchingGames.Count > 0)
                        {
                            var matchedUserDTO = new MatchedUserDTO
                            {
                                User = mapper.Map<UserDTO>(user),
                                UserGames = new List<UserGameDTO>()
                            };

                            foreach (var userGame in userGames)
                            {
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

                                userGameDTO.isMatching = matchingGames.Any(matchingGame => matchingGame.GameId == userGame.GameId);

                                matchedUserDTO.UserGames.Add(userGameDTO);
                            }
                            matchedUsers.Add(matchedUserDTO);
                        }
                    }
                    
                }
            }

            return Ok(matchedUsers);
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
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }
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
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
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
