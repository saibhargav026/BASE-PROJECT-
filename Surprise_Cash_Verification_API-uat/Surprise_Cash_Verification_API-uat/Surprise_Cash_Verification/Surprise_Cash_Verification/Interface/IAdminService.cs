using Surprise_Cash_Verification.Core.Tables;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.Models;

namespace Surprise_Cash_Verification.Interface
{
    public interface IAdminService
    {
        Task<IEnumerable<LOGIN_TYPE>> GetAllLoginTypesAsync(int? pageNumber = 1, int? pageSize = 100);
        Task<(bool IsSuccess, LOGIN_TYPE? organisations, string? Msg)> GetEmployeeByIdAsync(int id);
        Task<int> GetAllLoginTypeCountAsync();
        Task<IEnumerable<STAFF_ROLES>> GetAllStaffTypesAsync();
        Task<(bool IsSuccess, string? organisations, string? Msg)> GetStaffDetalsByEmpIdAsync(string empId);
        Task<(bool IsSuccess, string Message)> AddStaffAsync(AddStaffRequestDto request);
        Task<(bool IsSuccess, string? res, string? Msg)> UpdateEmployeeAsync(int id, string encryptedRequest); 
    }
}
