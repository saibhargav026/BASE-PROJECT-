namespace Surprise_Cash_Verification.Mapper.DTO
{
    public class BranchCompliedDTO
    {
        public string ActionTakenByBranch { get; set; }
        public string ActionTakenBranchId { get; set; }
        public string AnnexureStatusBranch { get; set; }
        public string SVBranchCode { get; set; }
        public int RefNo { get; set; }
    }

    public class ROCompliedDTO
    {
        public string ActionTakenByRO { get; set; }
        public string ActionTakenROId { get; set; }
        public string AnnexureStatusRO { get; set; }
        public string SVBranchCode { get; set; }
        public int RefNo { get; set; }
    }

    public class ZOCompliedDTO
    {
        public string ActionTakenByZO { get; set; }
        public string ActionTakenZOId { get; set; }
        public string AnnexureStatusZO { get; set; }
        public string SVBranchCode { get; set; }
        public int RefNo { get; set; }
    }
    public class COCompliedDTO
    {
        public string ActionTakenByCO { get; set; }
        public string ActionTakenCOId { get; set; }
        public string AnnexureStatusCO { get; set; }
        public int RefNo { get; set; }
    }
}
