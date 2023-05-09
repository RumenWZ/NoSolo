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
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromForm] GameAddRequestDTO game )
        {
            var image = game.Image;

            if (image == null)
            {
                return BadRequest("No image uploaded");
            } 

            var cloudinaryResult = await photoService.UploadPhotoAsync(image);

            var newGame = new Game
            {
                Name = game.Name,
                ImageUrl = cloudinaryResult.SecureUrl.ToString()
            };

            uow.GameRepository.Add(newGame.Name, newGame.ImageUrl);
            await uow.SaveAsync();

            return Ok(newGame);
        }
    }
}
