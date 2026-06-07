using Microsoft.EntityFrameworkCore;

namespace Surprise_Cash_Verification.Core.Tables.Master
{
    [Keyless]

    public class Questions
    {
        public string? Question { get; set; }
        public string? Answer { get; set; }
    }
}
