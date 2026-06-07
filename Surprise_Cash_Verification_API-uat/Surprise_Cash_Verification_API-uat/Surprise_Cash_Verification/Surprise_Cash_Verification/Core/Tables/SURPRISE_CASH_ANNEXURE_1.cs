using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("SURPRISE_CASH_ANNEXURE_1")]
    public class SURPRISE_CASH_ANNEXURE_1
    {
        [Key]
        public int REF_NO { get; set; }
        public string? FROM_DYRH_NAME { get; set; }
        public string? FROM_REGION_NAME { get; set; }
        public string? TO_BRANCH_OFFICER_NAME { get; set; }
        public string? TO_BRANCH_OFFICER_DESIGNATION { get; set; }
        public string? TO_BRANCH_OFFICER_BRANCH_NAME { get; set; }
        public string? APPLICATION_DATE { get; set; }
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }
        public string? UNIQUE_ID { get; set; }
        public string? IC_NO { get; set; }
        public DateTime? IC_NO_DATE { get; set; }
        public string? IO_BRANCH_CODE { get; set; }
        public string? SV_BRANCH_CODE { get; set; }
        public string? BRANCH_PFNO { get; set; }
        public string? FINANCIAL_YEAR { get; set; }
        public string? QUATER { get; set; }
        public string? FROM_BRANCH_NAME { get; set; }
        public string? DELETED_BY { get; set; }
        public DateTime? DELETED_ON { get; set; }
        public string? IS_DELETED { get; set; }
    }
}
