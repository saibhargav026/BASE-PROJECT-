using Microsoft.EntityFrameworkCore;

namespace Surprise_Cash_Verification.Core.Tables.Master
{
    [Keyless]
    public class Branch_master
    {
        public string? BRANCH_UCD1 { get; set; }
        public string? BRANCH_CODE { get; set; }
        public string? BRANCH_AREA { get; set; }
        public string? BRANCH_NAME { get; set; }
        public string? BRANCH_NAME_HINDI { get; set; }
        public string? SPL_BR { get; set; }
        public string? BR_ADD1 { get; set; }
        public string? BR_ADD2 { get; set; }
        public string? BR_ADD3 { get; set; }
        public string? PINCODE { get; set; }
        public DateTime? BR_EST_DATE { get; set; }
        public string? REGION_CODE { get; set; }
        public string? ZONE_CODE { get; set; }
        public string? STD_CODE { get; set; }
        public string? status { get; set; }
        public string? zone_name_eng { get; set; }
        public string? region_name { get; set; }
        public string? region_name_hindi { get; set; }
    }
}
