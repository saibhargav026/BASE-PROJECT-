using Surprise_Cash_Verification.Core.Tables;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.Mapper.DTO;
using Surprise_Cash_Verification.Mappers.DTO;
using Surprise_Cash_Verification.Models;

namespace Surprise_Cash_Verification.Interface
{
    public interface ISurpriseCashVerificationService
    {
        (bool IsSuccess, List<int> RefNos, string? ErrorMsg) AddAnnexureOneDetails(SurpriseCashAnnexure1DTO annexureOneDetails);
        (bool IsSuccess, string? ErrorMsg) AddAnnexureTwoDetails(SurpriseCashAnnexure2DTO annexureTwoDetails);
        (bool IsSuccess, string? ErrorMsg) AddAnnexureThreeDetails(SurpriseCashAnnexure3DTO annexureTwoDetails);
        (bool IsSuccess, string? ErrorMsg) AddAnnexureFourDetails(SurpriseCashAnnexure4DTO annexureTwoDetails);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByRegionCode(string regionCode);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByZoneCode(string zoneCode, string Quater);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByBranchCode(int REF_NO);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByCO(string zonecode, string currentFinalcialYear, string currentQuater);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureOneDetails(string empId);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureOneDetailsByPFno(string empId, string financialYear, string quarter);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureOneDetailsBySVBranchCode(string svbranchcode, string Current, string financialYear, string quarter, string regionCode);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureThreeDetails(string status, string code, string iszone);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetRegionDetails(string zoneCode);
        (bool IsSuccess, string? ErrorMsg) AddComment(CommentDTO commentDTO);
        (bool IsSuccess, string? ErrorMsg) AddApproved(ApprovedDTO approvedDTO);

        (bool IsSuccess, string? ErrorMsg) AddBranchComplied(BranchCompliedDTO branchCompliedDTO);
        (bool IsSuccess, string? ErrorMsg) AddROComplied(ROCompliedDTO roCompliedDTO);

        (bool IsSuccess, string? ErrorMsg) AddZOComplied(ZOCompliedDTO zoCompliedDTO);
        (bool IsSuccess, string? ErrorMsg) AddCOComplied(COCompliedDTO coCompliedDTO);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetApprovedAnnexureTwoDetails(string empId, string code, string quater, string iszone, string financialYear, string currentUser);

        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureFiveDetails();
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureFourDetails(string status, string code);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetApprovedAnnexureFourDetails(string empId, string zonecode, string iszone, string year, string quater);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByPFNo(string ReqParameter, string financialYear, string quarter, string regionCode, string regionName);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsCO(string financialYear, string quarter);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAllAnnexureOneData(string currentYear, string currentQuarter, string regionCode);
        Task<(bool IsSuccess, string? Msg)> DeleteAnnexureTwoData(int RefNo, string userid);
        Task<(bool IsSuccess, string? Msg)> DeleteAnnexureOneData(int RefNo, string userid);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByRegionCodeQuater(string FinancialYear, string Quater, string ZoneCode, string RegionCode);
        Task<SurpriseDateResult> GetLatestSurpriseDateAsync(string svBranchCode);
        Task<(bool IsSuccess, CashDetails? cashData, string? Msg)> GetDenominationsCashDetails(CashRequest request);
        Task<(bool IsSuccess, LOGIN_TYPE? organisations, string? Msg)> GetLogInTypeAsync(string emp_desgn);
        Task<(bool IsSuccess, LOGIN_TYPE? organisations, string? Msg)> GetCOLogInAsync(string location, string emp_id);
    }
}
