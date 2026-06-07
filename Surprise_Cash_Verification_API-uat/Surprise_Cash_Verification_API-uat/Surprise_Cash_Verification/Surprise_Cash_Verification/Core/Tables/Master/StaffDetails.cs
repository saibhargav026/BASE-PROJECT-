using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables.Master
{
    [Keyless]
    [Table("STAFF_DETAILS")]
    public class StaffDetails
    {
        public string EMP_ID { get; set; }
        public string? EMP_NAME { get; set; }
        public string? LOCATION { get; set; }
        public string? LOCATION_DESC { get; set; }
        public string? DEPTID { get; set; }
        public string? DEPT_ID_DESC { get; set; }
        public string? REGION_CODE { get; set; }
        public string? REGION_NAME { get; set; }
        public string? DIVISION_CODE { get; set; }
        public string? DIVISION_NAME { get; set; }
        public string? BR_CODE { get; set; }
        public string? EMP_DESGN { get; set; }
        public string? EMP_DESGN_DESC { get; set; }
        public string? EMP_SCALE_CODE { get; set; }
        public string? EMP_SCALE_DESCR { get; set; }
        public string? EMP_DATE_OF_BIRTH { get; set; }
        public string? EMP_JOINING_DATE { get; set; }
        public string? EXPECTED_END_DATE { get; set; }
        public string? ACC_NUM { get; set; }
        public string? SEX { get; set; }
        public string? POSTING_DATE { get; set; }
    }
    [Keyless]
    [Table("StaffDetails")]
    public class StaffDetails2
    {
      public string? PHONE { get; set; }
    }
}
