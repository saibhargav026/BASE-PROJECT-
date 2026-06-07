using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("STAFF_ROLES")]
    public class STAFF_ROLES
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }
        public string ROLE_NAME { get; set; }
        public string ROLE_CODE { get; set; }
    }
}
