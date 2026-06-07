using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("STATUS_OF_REPORT_BY_DYRH")]
    public class STATUS_OF_REPORT_BY_DYRH : BaseEntity
    {
        [Key]
        public int REF_NO { get; set; }
        public string? BRANCH_NAME { get; set; }
        public string? STATUS { get; set; }
        public string? REGION_NAME { get; set; }
        public string? NAME_OF_OFFICIER_NOMINATED { get; set; }
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? UNIQUE_ID { get; set; }
        public string? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }

    }
}
