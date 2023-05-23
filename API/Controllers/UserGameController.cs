using API.Data;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            var game = await uow.GameRepository.GetByIdAsync(request.GameId);
            if (user == null)
            {
                return BadRequest("User can not be found");
            }
            if (game == null)
            {
                return BadRequest("Game can not be found");
            }

            uow.UserGameRepository.Add(user.Id, game.Id, request.Description);
            await uow.SaveAsync();
            return Ok(201);
        }
        
    }
}
