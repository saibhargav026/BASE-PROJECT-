using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.Mappers.DTO;
using Surprise_Cash_Verification.Middleware;
using Surprise_Cash_Verification.Models;

namespace Surprise_Cash_Verification.Interface
{
    public interface IUserManagementServices
    {
        Task<(bool IsSuccess, string? userDetails, string? ErrorMsg)> validateUser(UserRequest request, string answer);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetStaffDetailsAfterLogin(string ReqParameter);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetStaffDetails(string empId);
        Task<(bool IsSuccess, List<Branch_master>? branch, string? Msg)> GetBranchByZoneRegion(string zoneCode, string regionCode);
        Task<(bool IsSuccess, List<StaffDetails>? branchDetails, string? Msg)> GetBranchDetailsByRegion(string REGION_CODE, string BR_CODE);
        Task<(bool IsSuccess, Branch_master? branchDetails, string? Msg)> GetBranchByBrCode(string brCode);
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureFourUsers();
        Task<(bool IsSuccess, string? organisations, string? answer, string? Msg)> GetQuestions();
        Task<(bool IsSuccess, List<Branch_master>? branch, string? Msg)> GetUnNominatedBranches(string FinancialYear, string Quarter, string RegionCode, string DivisionCode);
        (bool status, string token) InsertToken(USER_TOKEN user);
        Task<(bool IsSuccess,  string? Msg)> Logout(string userId);
    }
}
