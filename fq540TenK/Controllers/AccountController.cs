using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using System.Security.Claims;
using fq540TenK.Models;
using Microsoft.AspNet.Identity;

namespace fq540TenK.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {

        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin()
        {
            // Request a redirect to the external login provider
            return new ChallengeResult("Google", Url.Action("ExternalLoginCallback", "Account"));
        }

        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback()
        {

            var authenticateResult = await AuthenticationManager.AuthenticateAsync("ExternalCookie");

            if (authenticateResult != null)
            {
                string userEmail = authenticateResult.Identity.Claims.Where(c => c.Type == ClaimTypes.Email).Select(c => c.Value).SingleOrDefault();

                if (userEmail != null)
                {

                    if (userEmail.ToString() != "joe.ahern@fq540.com")
                    {
                        AuthenticationManager.SignOut();
                        return RedirectToAction("Index", "Home");
                    }

                    return RedirectToAction("ErrorBadLogin", "Home");
                }
                else
                {
                    return RedirectToAction("ErrorBadLogin", "Home");
                }
            }
            else
            {
                return RedirectToAction("ErrorBadLogin", "Home");
            }
            

        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

    }
}
