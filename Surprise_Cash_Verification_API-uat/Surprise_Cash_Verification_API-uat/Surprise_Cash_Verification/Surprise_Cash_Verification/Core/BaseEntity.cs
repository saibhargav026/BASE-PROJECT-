namespace Surprise_Cash_Verification.Core
{
    public class BaseEntity
    {
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }
        public Char? APPLICATION_STATUS { get; set; }
    }
}
