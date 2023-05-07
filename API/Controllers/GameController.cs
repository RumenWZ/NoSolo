using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        public GameController(
            IUnitOfWork uow
            ) 
        {
            this.uow = uow;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add(GameAddRequestDTO gameAddRequest)
        {
            if (String.IsNullOrEmpty(gameAddRequest.Name.Trim()) ||
                String.IsNullOrEmpty(gameAddRequest.ImageUrl.Trim()))
            {
                return BadRequest("Fields can not be empty");
            }
            uow.GameRepository.Add(gameAddRequest.Name, gameAddRequest.ImageUrl);
            await uow.SaveAsync();
            return StatusCode(201);
        }
    }
}
