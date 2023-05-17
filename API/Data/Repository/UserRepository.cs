using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
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

        public async Task<User> GetByIdAsync(int userId)
        {
            var user = await dc.Users.FindAsync(userId);
            return user;
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
