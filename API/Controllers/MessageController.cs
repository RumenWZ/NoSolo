using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IUnitOfWork uow;

        public MessageController(
            IUnitOfWork uow
            )
        {
            this.uow = uow;
        }

        [HttpPost("send-message/{token}/{username}/{message}")]
        public async Task<IActionResult> SendMessage(string token, string username, string message)
        {
            var user1 = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user1 == null)
            {
                return BadRequest("No user could be linkned to this token");
            }

            var user2 = await uow.UserRepository.GetByUserNameAsync(username);
            if (user2 == null)
            {
                return BadRequest("No user exists with this username");
            }

            var friendship = await uow.FriendsRepository.GetFriendshipAsync(user1.Id, user2.Id);
            if (friendship == null) {
                return BadRequest("The users do not know each other");
            } else if (friendship.Status != "accepted")
            {
                return BadRequest("These users are not friends");
            }
            uow.MessageRepository.SendMessage(user1.Id, user2.Id, message);
            await uow.SaveAsync();

            return Ok(201);
        }
    }
}
