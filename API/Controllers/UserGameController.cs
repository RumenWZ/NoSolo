﻿using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using Azure.Core;
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
            if (user == null)
            {
                return BadRequest("User can not be found");
            }
            var game = await uow.GameRepository.GetByIdAsync(request.GameId);
            if (game == null)
            {
                return BadRequest("Game can not be found");
            }

            uow.UserGameRepository.Add(user.Id, game.Id, request.Description);
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpGet("get-user-games/{username}")]
        public async Task<IActionResult> GetUserGames(string username)
        {

            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                return BadRequest("User can not be found");
            }
            var userGameList = await uow.UserGameRepository.GetUserGameListById(user.Id);
            var gameIds = userGameList.Select(ug => ug.GameId).ToList();
            var games = await uow.GameRepository.GetGamesByIds(gameIds);

            var userGameDTOs = new List<UserGameDTO>();

            foreach (var game in games)
            {
                var userGame = userGameList.FirstOrDefault(ug => ug.GameId == game.Id);
                var userGameDTO = new UserGameDTO
                {
                    GameId = game.Id,
                    GameName = game.Name,
                    GameImageUrl = game.ImageUrl,
                    UserDescription = userGame.Description
                };
                userGameDTOs.Add(userGameDTO);
            }

            return Ok(userGameDTOs);
        }
        
    }
}