using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("LOGIN_TYPE")]
    public class LOGIN_TYPE
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }
        public string? LOCATION { get; set; }
        public string? LOCATION_DESC { get; set; }
        public string? EMP_DESGN { get; set; }
        public string? EMP_DESGN_DESC { get; set; }
        public string USER_TYPE { get; set; }
        public string STATUS { get; set; }
        public string? EMP_ID { get; set; }
        public DateTime? CREATED_ON { get; set; }
    }
}
