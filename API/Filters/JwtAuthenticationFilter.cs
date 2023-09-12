using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class JwtAuthenticationFilter : IAsyncAuthorizationFilter
    {
        private readonly IAuthenticationService _authService;

        public JwtAuthenticationFilter(IAuthenticationService authService)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            if (context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any())
            {
                return;
            }

            var user = await _authService.GetUserFromTokenAsync(context.HttpContext);

            if (user == null)
            {
                context.Result = new BadRequestObjectResult("Invalid token");
            }
        }
    }
}
