using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("SURPRISE_CASH_ANNEXURE_4")]
    public class SURPRISE_CASH_ANNEXURE_4
    {
        [Key]
        public int REF_NO { get; set; }
        public string? REGIONAL_HEAD { get; set; }
        public string? REGIONAL_OFFICE { get; set; }
        public string? OPERATIONS_DEPARTMENT { get; set; }
        public string? CENTRAT_OFFICE_ANNEX { get; set; }
        public string? ANNEXURE_4_DATE { get; set; }
        public string? DISCREPANCIES { get; set; }
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }
        public string? UNIQUE_ID { get; set; }
        public string? ZONE_CODE { get; set; }
        public string? ZONE_NAME { get; set; }
        public string? ANNEXURE_STATUS { get; set; }
    }
}
