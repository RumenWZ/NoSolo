using API.DTOs;
using API.Helpers;
using API.Interfaces;
using API.Migrations;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PusherServer;
using dotenv.net;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public MessageController(
            IUnitOfWork uow,
            IMapper mapper
            )
        {
            this.uow = uow;
            this.mapper = mapper;

        }

        [HttpPost("send-message/{token}/{username}/{message}")]
        public async Task<IActionResult> SendMessage(string token, string username, string message)
        {
            DotEnv.Load();
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
            var newMessage = uow.MessageRepository.SendMessage(user1.Id, user2.Id, message);
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

        [HttpGet("get-messages-between-users/{token}/{username}")]
        public async Task<IActionResult> GetMessagesBetweenUsers(string token, string username)
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

            var messages = await uow.MessageRepository.GetMessagesBetweenUsersAsync(user1.Id, user2.Id);
            var messageDTOs = mapper.Map<IEnumerable<MessageDTO>>(messages);
            

            return Ok(messageDTOs);

        }

    }
}
