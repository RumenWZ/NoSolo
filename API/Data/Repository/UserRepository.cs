using API.DTOs;
using API.Interfaces;
using API.Migrations;
using API.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API.Data.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext dc;

        public UserRepository(DataContext dc)
        {
            this.dc = dc;

        }

        public async Task<User> Authenticate(string username, string password)
        {
            var user = await dc.Users.FirstOrDefaultAsync(u => u.Username == username);
        
            if (user == null || user.PasswordKey == null) {
                return null;
            }

            if (!MatchPasswordHash(password, user.Password, user.PasswordKey))
            {
                return null;
            }
        
            return user;
        }

        public UserDTO CreateUserDTO(User user)
        {
            var userDTO = new UserDTO()
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedOn = user.CreatedOn,
                ProfileImageUrl = user.ProfileImageUrl,
                DisplayName = user.DisplayName,
                DiscordUsername = user.DiscordUsername,
                Summary = user.Summary,
                IsAdmin = user.IsAdmin

            };
            return userDTO;
        }

        public async Task<IEnumerable<User>> FindUsers(string searchString)
        {
            var users = await dc.Users.Where(u => u.Username.Contains(searchString) 
                || u.DisplayName.Contains(searchString)).ToListAsync();
            return users;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await dc.Users.ToListAsync();
        }

        public async Task<User> GetByIdAsync(int userId)
        {
            var user = await dc.Users.FindAsync(userId);
            return user;
        }

        public async Task<User> GetByUserNameAsync(string username)
        {
            var user = await dc.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return null;
            }
            return user;
        }

        public async Task<User> GetUserByTokenAsync(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = "TemporarySuperTopSecretKeyWillChangeDestinationLater";
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            try
            {
                SecurityToken validatedToken;
                var principal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);

                var userIdString = principal.FindFirstValue(ClaimTypes.NameIdentifier);

                if (int.TryParse(userIdString, out int userId))
                {
                    var user = await dc.Users.FindAsync(userId);

                    return user;
                } else
                {
                    // some error
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public void Register(string username, string email, string password)
        {
            byte[] passwordHash, passwordKey;

            using (var hmac=new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }

            User user = new User();
            user.Username = username;
            user.Email = email;
            user.Password = passwordHash;
            user.PasswordKey = passwordKey;
            user.CreatedOn = DateTime.Now;
            user.DisplayName = user.Username;

            dc.Users.Add(user);
        }

        public async Task<bool> UserAlreadyExists(string username)
        {
            return await dc.Users.AnyAsync(x => x.Username == username);
        }

        private bool MatchPasswordHash(string passwordText, byte[] password, byte[] passwordKey)
        {

            using (var hmac = new HMACSHA512(passwordKey))
            {
                var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(passwordText));

                for (int i = 0; i < passwordHash.Length; i++)
                {
                    if (passwordHash[i] != password[i])
                        return false;
                }
                return true;
            }

        }
    }
}
