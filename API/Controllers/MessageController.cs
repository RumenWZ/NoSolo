using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PusherServer;
using dotenv.net;
using System.Web;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        private readonly IAuthenticationService auth;
        private readonly IStringValidationService stringValidator;

        public MessageController(
            IUnitOfWork uow,
            IMapper mapper,
            IAuthenticationService auth,
            IStringValidationService stringValidator
            )
        {
            this.uow = uow;
            this.mapper = mapper;
            this.auth = auth;
            this.stringValidator = stringValidator;
        }

        [HttpPost("send-message/{username}/{message}")]
        public async Task<IActionResult> SendMessage(string username, string message)
        {
            string originalMessage = HttpUtility.UrlDecode(message);

            if (!stringValidator.isValidLength(originalMessage, 0, 200)) {
                return BadRequest("Your message is too long");
            }

            var user1 = await auth.GetUserFromTokenAsync(HttpContext);
            if (user1 == null)
            {
                return BadRequest("Invalid token");
            }

            var user2 = await uow.UserRepository.GetByUserNameAsync(username);
            if (user2 == null)
            {
                return BadRequest("No user exists with this username");
            }

            var friendship = await uow.FriendsRepository.GetFriendshipAsync(user1.Id, user2.Id);
            if (friendship == null) {
                return BadRequest("These users do not know each other");
            } else if (friendship.Status != "accepted")
            {
                return BadRequest("These users are not friends");
            }
            var newMessage = uow.MessageRepository.SendMessage(user1.Id, user2.Id, originalMessage);
            await uow.SaveAsync();
            var newMessageDTO = mapper.Map<MessageDTO>(newMessage);

            var pusher = new Pusher(
                Environment.GetEnvironmentVariable("PUSHER_APP_ID"),
                Environment.GetEnvironmentVariable("PUSHER_APP_KEY"),
                Environment.GetEnvironmentVariable("PUSHER_APP_SECRET"),
                new PusherOptions
            {
                Cluster = Environment.GetEnvironmentVariable("PUSHER_APP_CLUSTER"),
                Encrypted = true
            });
            await pusher.TriggerAsync("my-channel", "my-event", new { message = newMessageDTO });

            return Ok(201);
        }

        [HttpGet("get-messages-between-users/{username}")]
        public async Task<IActionResult> GetMessagesBetweenUsers(string username)
        {
            var user1 = await auth.GetUserFromTokenAsync(HttpContext);
            if (user1 == null)
            {
                return BadRequest("Invalid token");
            }

            var user2 = await uow.UserRepository.GetByUserNameAsync(username);
            if (user2 == null)
            {
                return BadRequest("No user exists with this username");
            }

            var messages = await uow.MessageRepository.GetMessagesBetweenUsersAsync(user1.Id, user2.Id);
            var messageDTOs = mapper.Map<IEnumerable<MessageDTO>>(messages);
            

            return Ok(messageDTOs);

        }

    }
}
