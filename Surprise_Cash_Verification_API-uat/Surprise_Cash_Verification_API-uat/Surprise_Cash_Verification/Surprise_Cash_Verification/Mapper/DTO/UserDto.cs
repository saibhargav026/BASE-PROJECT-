using Surprise_Cash_Verification.Core.Tables.Master;

namespace Surprise_Cash_Verification.Mappers.DTO
{
    public class UserRequest
    {
        public string user_id { get; set; }
        public string ps { get; set; }
        public string? captcha { get; set; }
    }
    public class UserDetails
    {
        public string user_id { get; set; }
        public string user_name { get; set; }
        public string validation_status { get; set; }
    }
    public class User_Details
    {
        public User_Details1 User { get; set; }

        public string token { get; set; }
    }

    public class User_Details1
    {
        public string user_id { get; set; }
        public string user_name { get; set; }
        public string validation_status { get; set; }

        public string token { get; set; }
    }
    public class UserDetailsresponse
    {
        public string username { get; set; }
        public string ps { get; set; }
        public string empScaleCode { get; set; }
        public string designation { get; set; }
    }
    public class MyDairyDecryptRequestDto
    {
        public string EncryptedText { get; set; }
    }
}

