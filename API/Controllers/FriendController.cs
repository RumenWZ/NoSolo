using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public FriendController(
            IUnitOfWork uow,
            IMapper mapper
            )
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpPost("send-friend-request/{token}/{username}")]
        public async Task<IActionResult> SendFriendRequest(string token, string username)
        {
            var sender = await uow.UserRepository.GetUserByTokenAsync(token);
            if (sender == null)
            {
                return BadRequest("No user was found corresponding with the token");
            }
            var receiver = await uow.UserRepository.GetByUserNameAsync(username);
            if (receiver == null)
            {
                return BadRequest("The receiving user could not be found");
            }

            uow.FriendsRepository.SendFriendRequest(sender.Id, receiver.Id);
            await uow.SaveAsync();

            return Ok(201);
        }

        [HttpGet("get-friendship-requests-of-user/{token}")]
        public async Task<IActionResult> GetFriendshipRequestsOfUser(string token)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }
            var friendRequests = await uow.FriendsRepository.GetAllRequestedFriendshipsOfUserAsync(user.Id);

            var friendRequestDTOs = mapper.Map<IEnumerable<UserDTO>>(friendRequests);

            return Ok(friendRequestDTOs);
        }

        [HttpGet("get-my-friend-requests/{token}")]
        public async Task<IActionResult> GetAllIncomingFriendRequests(string token)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return BadRequest("User could not be found");
            }
            var friendRequests = await uow.FriendsRepository.GetUserIncomingFriendRequestsAsync(user.Id);
            var friendRequestDTOs = mapper.Map<IEnumerable<UserDTO>>(friendRequests);

            return Ok(friendRequestDTOs);
        }

        [HttpGet("get-all-my-friends/{token}")]
        public async Task<IActionResult> GetAllMyFriends(string token)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return BadRequest("User could not be found");
            }
            var myFriends = await uow.FriendsRepository.GetAllFriendsOfUserAsync(user.Id);
            var myFriendsDTOs = mapper.Map<IEnumerable<UserDTO>>(myFriends);

            return Ok(myFriendsDTOs);
        }


        [HttpGet("get-friendship/{token}/{username}")]
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
                return Ok(null);
            }

            var friendshipDTO = uow.FriendsRepository.CreateFriendshipDTO(friendship);

            return Ok(friendshipDTO);
        }

        [HttpPatch("accept-friend-request/{token}/{username}")]
        public async Task<IActionResult> AcceptFriendRequest(string token, string username)
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
            if (friendship.Status != "pending")
            {
                return BadRequest("The friendship status isn't pending");
            }

            friendship.Status = "accepted";
            friendship.FriendsSince = DateTime.Now;
            await uow.SaveAsync();

            return Ok(201);
        }


        [HttpDelete("delete-friendship/{token}/{username}")]
        public async Task<IActionResult> DeleteFriendship(string token, string username)
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

            await uow.FriendsRepository.Delete(friendship.Id);
            await uow.SaveAsync();

            return Ok(201);
        }
    }
}
