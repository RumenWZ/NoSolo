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
        public async Task<IActionResult> Add(int userid, int gameid, string description)
        {
            //var user = dc.Users.FirstOrDefault(x => x.Id  == userid);
            //var game = dc.Games.FirstOrDefault(x => x.Id == gameid);
            //if (user == null)
            //{
            //    return BadRequest("User can not be found");
            //}
            //if (game == null)
            //{
            //    return BadRequest("Game can not be found");
            //}
        
            uow.UserGameRepository.Add(userid, gameid, description);
            await uow.SaveAsync();
            return Ok(201);
        }
        
    }
}
