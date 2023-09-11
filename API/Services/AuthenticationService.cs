using API.Extensions;
using API.Interfaces;
using API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUnitOfWork _uow;
        private readonly string _secretKey = "TemporarySuperTopSecretKeyWillChangeDestinationLater";

        public AuthenticationService(
            IHttpContextAccessor httpContextAccessor,
            IUnitOfWork uow)
        {
            _httpContextAccessor = httpContextAccessor;
            _uow = uow;
        }

        public async Task<User> GetUserFromTokenAsync(HttpContext httpContext)
        {
            var token = httpContext.GetAuthToken();

            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
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
                    var user = await _uow.UserRepository.GetByIdAsync(userId);
                    return user;
                }
            }
            catch (Exception ex)
            {
                
            }

            return null;
        }
    }
}
