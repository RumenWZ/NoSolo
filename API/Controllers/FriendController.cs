using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly IUnitOfWork uow;

        public FriendController(
            IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpPost("send-friend-request")]
        public async Task<IActionResult> SendFriendRequest(string senderUserToken, string receiverUsername)
        {
            var sender = await uow.UserRepository.GetUserByTokenAsync(senderUserToken);
            if (sender == null)
            {
                return BadRequest("No user was found corresponding with the token");
            }
            var receiver = await uow.UserRepository.GetByUserNameAsync(receiverUsername);
            if (receiver == null)
            {
                return BadRequest("The receiving user could not be found");
            }

            uow.FriendsRepository.SendFriendRequest(sender.Id, receiver.Id);
            await uow.SaveAsync();

            return Ok(201);
        }
    }
}
