using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromForm] GameAddRequestDTO game )
        {
            var image = game.Image;

            if (image == null)
            {
                return BadRequest("No image uploaded");
            } else if (game.Name == null)
            {
                return BadRequest("Name can not be empty");
            } 

            var cloudinaryResult = await photoService.UploadPhotoAsync(image);

            var newGame = new Game
            {
                Name = game.Name,
                ImageUrl = cloudinaryResult.SecureUrl.ToString(),
            };

            uow.GameRepository.Add(newGame.Name, newGame.ImageUrl);
            await uow.SaveAsync();

            return Ok(newGame);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.GameRepository.Delete(id);
            await uow.SaveAsync();
            return Ok(id);
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
