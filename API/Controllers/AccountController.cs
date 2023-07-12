using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
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

        public AccountController(
            IUnitOfWork uow,
            IPhotoService photoService,
            IMapper mapper
            )
        {
            this.uow = uow;
            this.photoService = photoService;
            this.mapper = mapper;
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

        [HttpGet("{userId}")]
        public async Task<IActionResult> FindUserById(int userId)
        {
            var user = await uow.UserRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return BadRequest("User could not be found");
            }
            return Ok(user);
        }

        [HttpGet("get-user-by-token/{token}")]
        public async Task<IActionResult> FindUserByToken(string token)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return BadRequest("User could not be found");
            }
            var userDTO = uow.UserRepository.CreateUserDTO(user);
            return Ok(userDTO);
        }

        [HttpGet("find-users/{searchString}")]
        public async Task<IActionResult> FindUsers(string searchString)
        {
            var users = await uow.UserRepository.FindUsers(searchString);
            if (users == null)
            {
                return Ok(new {});
            }
            var userDTOs = mapper.Map<IEnumerable<UserDTO>>(users);
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

        [HttpPatch("update-photo/{username}")]
        public async Task<IActionResult> UpdateUserPhoto(string username, [FromForm] UpdateUserPhotoDTO updateRequest)
        {
            var user = await uow.UserRepository.GetByUserNameAsync(username);
            var photo = updateRequest.Image;

            if (user == null)
            {
                throw new Exception("User does not exist");
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

        [HttpPatch("update-display-name/{username}")]
        public async Task<IActionResult> UpdateDisplayName(string username, string displayName)
        {
            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                return BadRequest("User could not be found");
            }
            user.DisplayName = displayName;
            await uow.SaveAsync();

            return Ok(201);
        }

        [HttpPatch("update-discord-username/{username}")]
        public async Task<IActionResult> UpdateDiscordUsername(string username, string? discordUsername = null)
        {
            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                return BadRequest("User could not be found");
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

        [HttpPatch("update-summary/{username}")]
        public async Task<IActionResult> UpdateSummary(string username, string summary)
        {
            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                return BadRequest("User could not be found");
            }
            user.Summary = summary;
            await uow.SaveAsync();

            return Ok(201);
        }


        //*********************************************
        private string CreateJWT(User user)
        {
            var secretKey = "TemporarySuperTopSecretKeyWillChangeDestinationLater";
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
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = signInCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
