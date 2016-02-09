using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using Microsoft.Owin.Security;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace fq540TenK
{
    public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            var cookieOptions = new CookieAuthenticationOptions
            {
                CookieName = "fq54010K",
                AuthenticationType = "ExternalCookie",
                LoginPath = new PathString("/Account/Login/")
            };

            app.UseCookieAuthentication(cookieOptions);
            app.SetDefaultSignInAsAuthenticationType(cookieOptions.AuthenticationType);

            var googleOptions = new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "34141593357-62hkeoos2ajdh7sl40p8nn5eqf1ua7bf.apps.googleusercontent.com",
                ClientSecret = "Rwl7HXa7rUZTOGKzz9xk4J7X",
                CallbackPath = new PathString("/Account/ExternalLoginCallback/"),
                Provider = new GoogleOAuth2AuthenticationProvider()
                {
                    OnAuthenticated = context =>
                    {
                        context.Identity.AddClaim(new Claim("urn:token:google", context.AccessToken));
                        return Task.FromResult(true);
                    }
                }

            };

            app.UseGoogleAuthentication(googleOptions);

        }
    }

}