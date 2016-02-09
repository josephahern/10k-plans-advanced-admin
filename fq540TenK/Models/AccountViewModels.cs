using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace fq540TenK.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        public string access_token { get; set; }
        [EmailAddress]
        public string email { get; set; }
        public string name { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}
