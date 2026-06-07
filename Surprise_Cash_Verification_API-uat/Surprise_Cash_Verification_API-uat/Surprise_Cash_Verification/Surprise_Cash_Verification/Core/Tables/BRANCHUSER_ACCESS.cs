using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("BRANCH_USER_ACCESS")]
    public class BRANCH_USER_ACCESS
    {
        [Key]
        public int REFNO { get; set; }
        public string? RO_CODE { get; set; }
        public string? RO_USERID { get; set; }
        public string? BRANCH_CODE { get; set; }
        public string? BRANCH_USERID { get; set; }
        public string? STATUS { get; set; }
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? UNIQUEID { get; set; }
    }
}
