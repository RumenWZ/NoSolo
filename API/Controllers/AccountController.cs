﻿using API.DTOs;
using API.Interfaces;
using API.Migrations;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IPhotoService photoService;
        private readonly IMapper mapper;
        private readonly IAuthenticationService auth;

        public AccountController(
            IUnitOfWork uow,
            IPhotoService photoService,
            IMapper mapper,
            IAuthenticationService auth
            )
        {
            this.uow = uow;
            this.photoService = photoService;
            this.mapper = mapper;
            this.auth = auth;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDTO loginRequest)
        {
            var user = await uow.UserRepository.Authenticate(loginRequest.Username, loginRequest.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }
            var loginResponse = new LoginResponseDTO();
            loginResponse.Username = user.Username;
            loginResponse.Token = CreateJWT(user);

            return Ok(loginResponse);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDTO registerRequest)
        {
            if (String.IsNullOrEmpty(registerRequest.Username.Trim()) ||
                String.IsNullOrEmpty(registerRequest.Password.Trim())) {
                return BadRequest("Username or Password can not be empty");
            }

            if (await uow.UserRepository.UserAlreadyExists(registerRequest.Username))
            {
                return BadRequest("User already exists");
            }
            uow.UserRepository.Register(registerRequest.Username, registerRequest.Email, registerRequest.Password);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet("get-logged-in-user")]
        public async Task<IActionResult> GetLoggedInUser()
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            var userDTO = uow.UserRepository.CreateUserDTO(user);
            return Ok(userDTO);
        }

        [HttpGet("find-users/{searchString}")]
        public async Task<IActionResult> FindUsers(string searchString)
        {
            var loggedInUser = await auth.GetUserFromTokenAsync(HttpContext);
            if (loggedInUser == null)
            {
                return BadRequest("Invalid token");
            }

            var userSearchResults = await uow.UserRepository.FindUsers(searchString);
            if (userSearchResults == null)
            {
                return Ok(new {});
            }
            var userDTOs = mapper.Map<IEnumerable<FindUserDTO>>(userSearchResults);
            
            foreach (var user in userDTOs)
            {
                if (user.Id == loggedInUser.Id)
                {
                    user.FriendStatus = "self";
                    continue;
                }
                
                var friendship = await uow.FriendsRepository.GetFriendshipAsync(loggedInUser.Id, user.Id);
                
                if (friendship != null)
                {
                    if (friendship.Status == "accepted")
                    {
                        user.FriendStatus = "friends";
                    }
                    else if (friendship.Status == "pending")
                    {
                        user.FriendStatus = "pending";
                    } 
                    else
                    {
                        user.FriendStatus = "";
                    }
                   
                } else
                {
                    user.FriendStatus = "";
                }
                
                
            }
            return Ok(userDTOs);
        }

        [HttpGet("get-user-by-username/{username}")]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                return BadRequest("No such user exists");
            }
            var userDTO = uow.UserRepository.CreateUserDTO(user);
            return Ok(userDTO);
        }

        [HttpPatch("update-photo/")]
        public async Task<IActionResult> UpdateUserPhoto([FromForm] UpdateUserPhotoDTO updateRequest)
        {

            var photo = updateRequest.Image;

            if (!photoService.IsImageValidFormat(photo))
            {
                return BadRequest("Invalid image format. Please upload an image in JPEG,JPG or PNG format");
            }
            else if (!photoService.IsImageValidSize(photo, 1.5 * 1024 * 1024))
            {
                return BadRequest("Image can not be larger than 1.5 MB");
            }

            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            if (user.ProfileImageUrl != "")
            {
                await photoService.DeletePhotoAsync(user.ProfileImageUrl);
            }

            var cloudinaryResult = await photoService.UploadPhotoAsync(photo);
            if (cloudinaryResult == null)
            {
                throw new Exception("Some error occured while uploading photo");
            }

            user.ProfileImageUrl = cloudinaryResult.SecureUrl.ToString();
            await uow.SaveAsync();

            var response = new
            {
                ProfileImageUrl = user.ProfileImageUrl
            };

            return Ok(response);
        }

        [HttpPatch("update-display-name")]
        public async Task<IActionResult> UpdateDisplayName(string? displayName = null)
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            user.DisplayName = displayName;
            await uow.SaveAsync();

            return Ok(201);
        }

        [HttpPatch("update-discord-username")]
        public async Task<IActionResult> UpdateDiscordUsername(string? discordUsername = null)
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            if (!string.IsNullOrEmpty(discordUsername))
            {
                user.DiscordUsername = discordUsername;
            } else
            {
                user.DiscordUsername = string.Empty;
            }
            
            await uow.SaveAsync();

            return Ok(201);
        }

        [HttpPatch("update-summary/")]
        public async Task<IActionResult> UpdateSummary(string summary)
        {
            var user = await auth.GetUserFromTokenAsync(HttpContext);
            if (user == null)
            {
                return BadRequest("Invalid token");
            }
            user.Summary = summary;
            await uow.SaveAsync();

            return Ok(201);
        }

        private string CreateJWT(User user)
        {
            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

            };

            var signInCredentials = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = signInCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
