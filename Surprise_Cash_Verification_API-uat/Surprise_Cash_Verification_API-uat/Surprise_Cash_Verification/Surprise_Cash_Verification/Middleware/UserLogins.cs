using System.ComponentModel.DataAnnotations;

namespace Surprise_Cash_Verification.Middleware
{
    public class UserLogins
    {
        [Required]
        public string UserName
        {
            get;
            set;
        }
        [Required]
        public string ps
        {
            get;
            set;
        }
        public UserLogins() { }
    }
}
