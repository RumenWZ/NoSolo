using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
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
        private readonly IConfiguration configuration;
        private readonly IPhotoService photoService;

        public AccountController(
            IUnitOfWork uow,
            IConfiguration config,
            IPhotoService photoService
            )
        {
            this.uow = uow;
            this.configuration = config;
            this.photoService = photoService;
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

        [HttpGet("get-user-by-username/{username}")]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                return BadRequest("No such user exists");
            }
            return Ok(user);
        }

        [HttpPatch("update-photo/{username}")]
        public async Task<IActionResult> UpdateUserPhoto(string username, IFormFile photo)
        {
            var user = await uow.UserRepository.GetByUserNameAsync(username);
            if (user == null)
            {
                throw new Exception("User does not exist");
            }

            var cloudinaryResult = await photoService.UploadPhotoAsync(photo);
            if (cloudinaryResult == null)
            {
                throw new Exception("Some error occured while uploading photo");
            }

            user.ProfileImageUrl = cloudinaryResult.SecureUrl.ToString();
            await uow.SaveAsync();

            return Ok();
        }

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
