using Microsoft.EntityFrameworkCore;

namespace Surprise_Cash_Verification.Core.Tables.Master
{
    [Keyless]
    public class RegionMaster
    {
        public string? region_code { get; set; }
        public string? region_name { get; set; }
        public string? region_name_hindi { get; set; }
        public string? regional_head { get; set; }
        public string? regional_head_no { get; set; }
        public string? status { get; set; }
        public string? zone_code { get; set; }
        public string? regional_email { get; set; }
    }
}
