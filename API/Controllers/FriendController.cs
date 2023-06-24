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



        [HttpGet("get-my-friend-requests")]
        public async Task<IActionResult> GetAllIncomingFriendRequests(string token)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return BadRequest("User could not be found");
            }
            var friendRequests = await uow.FriendsRepository.GetUserIncomingFriendRequestsAsync(user.Id);
            return Ok(friendRequests);
        }

        [HttpGet("get-friendship")]
        public async Task<IActionResult> GetFriendship(string token, string username)
        {
            var user1 = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user1 == null)
            {
                return BadRequest("No user was found corresponding with the token");
            }
            var user2 = await uow.UserRepository.GetByUserNameAsync(username);
            if (user2 == null)
            {
                return BadRequest("No user was found with this username");
            }
            var friendship = await uow.FriendsRepository.GetFriendshipAsync(user1.Id, user2.Id);
            if (friendship == null)
            {
                return BadRequest("These users have never contacted each other");
            }

            return Ok(friendship);
        }
    }
}
