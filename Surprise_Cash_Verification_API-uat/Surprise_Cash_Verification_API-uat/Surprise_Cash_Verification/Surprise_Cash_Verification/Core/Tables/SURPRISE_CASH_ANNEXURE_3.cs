using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("SURPRISE_CASH_ANNEXURE_3")]
    public class SURPRISE_CASH_ANNEXURE_3
    {
        [Key]
        public int REF_NO { get; set; }
        public string? REGIONAL_HEAD { get; set; }
        public string? REGIONAL_OFFICE { get; set; }
        public string? ZONAL_HEAD { get; set; }
        public string? ZONAL_OFFICE { get; set; }
        public string? ANNEXURE_3_DATE { get; set; }
        public string? DISCREPANCIES { get; set; }
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }
        public string? UNIQUE_ID { get; set; }
        public string? REGION_CODE { get; set; }
        public string? ZONE_CODE { get; set; }
        public string? FINANCIAL_YEAR { get; set; }
        public string? QUATER { get; set; }
        public string? ANNEXURE_STATUS { get; set; }
    }
}
