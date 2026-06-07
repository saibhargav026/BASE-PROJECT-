using Microsoft.EntityFrameworkCore;

namespace Surprise_Cash_Verification.Core.Tables.Master
{
    [Keyless]
    public class ZoneMaster
    {
        public string? zone_code { get; set; }
        public string? zone_name_eng { get; set; }
        public string? status { get; set; }
        public string? zone_head { get; set; }
        public string? zone_head_no { get; set; }
        public string? zone_email { get; set; }
    }
}
