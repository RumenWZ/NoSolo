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
        private readonly IAuthenticationService auth;

        public FriendController(
            IUnitOfWork uow,
            IMapper mapper,
            IAuthenticationService auth
            )
        {
            this.uow = uow;
            this.mapper = mapper;
            this.auth = auth;
        }

        [HttpPost("send-friend-request/{username}")]
        public async Task<IActionResult> SendFriendRequest(string username)
        {
            var sender = await auth.GetUserFromTokenAsync(HttpContext);
            if (sender == null)
            {
                return BadRequest("Invalid token");
            }

            var receiver = await uow.UserRepository.GetByUserNameAsync(username);
            if (receiver == null)
            {
                return BadRequest("The receiving user could not be found");
            }
            var friendship = await uow.FriendsRepository.GetFriendshipAsync(sender.Id, receiver.Id);
            if (friendship == null)
            {
                uow.FriendsRepository.SendFriendRequest(sender.Id, receiver.Id);
                await uow.SaveAsync();

                return Ok(201);
            }
            if (friendship.Status == "pending")
            {
                return BadRequest("There is already a pending friend request");
            }
            else if (friendship.Status == "accepted")
            {
                return BadRequest("You are already friends with this user.");
            } else
            {
                return BadRequest("Some unknown error occured while sending a friend request");
            }
            
        }

        [HttpGet("get-friendship-requests-of-user")]
        public async Task<IActionResult> GetFriendshipRequestsOfUser()
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            var friendRequests = await uow.FriendsRepository.GetAllRequestedFriendshipsOfUserAsync(user.Id);

            var friendRequestDTOs = mapper.Map<IEnumerable<UserDTO>>(friendRequests);

            return Ok(friendRequestDTOs);
        }

        [HttpGet("get-my-friend-requests")]
        public async Task<IActionResult> GetAllIncomingFriendRequests()
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            var friendRequests = await uow.FriendsRepository.GetUserIncomingFriendRequestsAsync(user.Id);
            var friendRequestDTOs = mapper.Map<IEnumerable<UserDTO>>(friendRequests);

            return Ok(friendRequestDTOs);
        }

        [HttpGet("get-all-my-friends")]
        public async Task<IActionResult> GetAllMyFriends()
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            var myFriends = await uow.FriendsRepository.GetAllFriendsOfUserAsync(user.Id);
            var myFriendsDTOs = mapper.Map<IEnumerable<UserDTO>>(myFriends);

            return Ok(myFriendsDTOs);
        }


        [HttpGet("get-friendship/{username}")]
        public async Task<IActionResult> GetFriendship(string username)
        {
            var user1 = await auth.GetUserFromTokenAsync(HttpContext);
            if (user1 == null)
            {
                return BadRequest("Invalid token");
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

        [HttpPatch("accept-friend-request/{username}")]
        public async Task<IActionResult> AcceptFriendRequest(string username)
        {
            var user1 = await auth.GetUserFromTokenAsync(HttpContext);
            if (user1 == null)
            {
                return BadRequest("Invalid token");
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


        [HttpDelete("delete-friendship/{username}")]
        public async Task<IActionResult> DeleteFriendship(string username)
        {
            var user1 = await auth.GetUserFromTokenAsync(HttpContext);
            if (user1 == null)
            {
                return BadRequest("Invalid token");
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
