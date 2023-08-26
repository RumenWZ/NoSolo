using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IPhotoService photoService;

        public GameController(
            IUnitOfWork uow,
            IPhotoService photoService
            ) 
        {
            this.uow = uow;
            this.photoService = photoService;
        }

        [HttpPost("add/{token}")]
        public async Task<IActionResult> Add(string token, [FromForm] GameAddRequestDTO game )
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return BadRequest("Invalid user token");
            } else if (!user.IsAdmin)
            {
                return BadRequest("You are not authorized to perform this action");
            }
            
            var image = game.Image;

            if (image == null)
            {
                return BadRequest("No image uploaded");
            } else if (game.Name == null)
            {
                return BadRequest("Name field can not be empty");
            }

            var existingGame = await uow.GameRepository.GetByNameAsync(game.Name);
            if (existingGame != null)
            {
                return BadRequest("A game with the same name already exists");
            }

            var cloudinaryResult = await photoService.UploadPhotoAsync(image);

            var newGame = new Game
            {
                Name = game.Name,
                ImageUrl = cloudinaryResult.SecureUrl.ToString(),
            };

            uow.GameRepository.Add(newGame.Name, newGame.ImageUrl);
            await uow.SaveAsync();

            return Ok(201);
        }

        [HttpDelete("delete/{token}/{id}")]
        public async Task<IActionResult> Delete(string token, int id)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return BadRequest("Invalid user token");
            }
            else if (!user.IsAdmin)
            {
                return BadRequest("You are not authorized to perform this action");
            }

            var game = await uow.GameRepository.GetByIdAsync(id);
            if (game == null)
            {
                return BadRequest("Game does not exist");
            }
            await photoService.DeletePhotoAsync(game.ImageUrl);

            await uow.GameRepository.Delete(id);
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAllAsync()
        {
            var games = await uow.GameRepository.GetAllAsync();
            return Ok(games);
        }

        [HttpGet("gameId")]
        public async Task<IActionResult> GetByIdAsync(int gameId)
        {
            var game = await uow.GameRepository.GetByIdAsync(gameId);
            if (game == null)
            {
                return BadRequest("Game could not be found");
            }
            
            return Ok(game);
        }
    }
}
