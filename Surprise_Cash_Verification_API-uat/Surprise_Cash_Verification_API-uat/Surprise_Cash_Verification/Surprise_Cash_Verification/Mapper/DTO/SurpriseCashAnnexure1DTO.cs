namespace Surprise_Cash_Verification.Mapper.DTO
{
    public class SurpriseCashAnnexure1DTO
    {
        public int RefNo { get; set; }
        public string? FromDyrhName { get; set; }
        public string? FromRegionName { get; set; }
        //public string? ToBranchOfficierName { get; set; }
        //public string? ToBranchOfficierDesignation { get; set; }
        //public string? ToBranchOfficierBranchName { get; set; }
        //public string? ApplicationDate { get; set; }
        public string? CreatedBy { get; set; }
        public string? ModifiedBy { get; set; }
        public string? RegionCode { get; set; }
        //public string? BranchEmpId { get; set; }
        public string? LoggedUserId { get; set; }
        //public string? IoBranchCode { get; set; }
        //public string? SvBranchCode { get; set; }
        //public string? ICNO { get; set; }
        //public DateTime? ICNODate { get; set; }
        public string? FinancialYear { get; set; }
        public string? Quater { get; set; }
        public string? FromBranchName { get; set; }
        public string? IsDeleted { get; set; }
        public string? FullFinancialYear { get; set; }
        public List<BranchDTO> newBranches { get; set; }
        public List<OfficerDTO> officers { get; set; }
    }
    public class BranchDTO
    {
        public string? SvBranchCode { get; set; }
        public string? IoBranchCode { get; set; }
    }
    public class OfficerDTO
    {
        public string? ToBranchOfficierBranchName { get; set; }
        public string? ToBranchOfficierDesignation { get; set; }
        public string? ToBranchOfficierName { get; set; }
        public string? BranchEmpId { get; set; }
        public string? ApplicationDate { get; set; }
        public string? ICNO { get; set; }
        public DateTime? ICNODate { get; set; }
    }
}
