using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OnlineAcOpening.Interface;
using Surprise_Cash_Verification.Core.DbConn;
using Surprise_Cash_Verification.Core.Tables;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.DbConn;
using Surprise_Cash_Verification.Interface;
using Surprise_Cash_Verification.Models;
using System.ComponentModel.DataAnnotations;

namespace Surprise_Cash_Verification.Services
{
    public class AdminService : IAdminService
    {
        private readonly SurpriseCashDbContext dbContext;
        private readonly OrganisationsDbContext organisationsDbContext;
        private readonly ILogger<AdminService> _logger;

        public AdminService(SurpriseCashDbContext dbContext, OrganisationsDbContext organisationsDbContext,
            ILogger<AdminService> logger, IUserManagementServices userManagementService)
        {
            this.dbContext = dbContext;
            this.organisationsDbContext = organisationsDbContext;
            this._logger = logger;
        }

        public async Task<(bool IsSuccess, string Message)> AddStaffAsync(AddStaffRequestDto request)
        {
            _logger?.LogInformation($"AddStaffAsync Service Started, request object is: {JsonConvert.SerializeObject(request)}");
            if (request is null)
                return (false, "Invalid request");
            if (request.UserType == "CO")
            {
                if (string.IsNullOrEmpty(request.EmployeeId))
                {
                    _logger?.LogInformation($"AddStaffAsync Service, Employee Id is required for Central Officer: {request.EmployeeId}");
                    return (false, "Employee Id is required for Central Officer");
                }

                var exists = await dbContext.LOGIN_TYPE.FirstOrDefaultAsync(x => x.USER_TYPE == request.UserType && x.EMP_ID == request.EmployeeId);
                if (exists != null)
                {
                    _logger?.LogInformation($"AddStaffAsync Service, Central Officer already exists: {request.EmployeeId}");
                    return (false, "Employee already exists");
                }
                var data = new LOGIN_TYPE
                {
                    USER_TYPE = request.UserType,
                    EMP_ID = request.EmployeeId,
                    STATUS = request.Status,
                    CREATED_ON = DateTime.Now,
                    LOCATION = request.EmployeeLocationCode,
                    LOCATION_DESC = request.EmployeeLocationDescription,
                    EMP_DESGN_DESC = request.EmployeeDesignationDescription
                };
                await dbContext.LOGIN_TYPE.AddAsync(data);
                await dbContext.SaveChangesAsync();
                _logger?.LogInformation($"AddStaffAsync Service, Central Officer added successfully: {request.EmployeeId}");
                _logger?.LogInformation($"AddStaffAsync Service Ended");
                return (true, "Employee added successfully");
            }
            else if (request.UserType == "DYRH" || request.UserType == "BH" || request.UserType == "ZO")
            {
                if (string.IsNullOrEmpty(request.EmployeeDesignationCode))
                {
                    _logger?.LogInformation($"AddStaffAsync Service, Employee Designation Code is required for DYRH,BH,ZO: {request.EmployeeDesignationCode}");
                    return (false, "Employee Designation Code is required");
                }

                var exists = await dbContext.LOGIN_TYPE.FirstOrDefaultAsync(x => x.USER_TYPE == request.UserType && x.EMP_DESGN == request.EmployeeDesignationCode);

                if (exists != null)
                {
                    _logger?.LogInformation($"AddStaffAsync Service, Employee already exists: {request.EmployeeDesignationCode}");
                    return (false, "Employee already exists");
                }

                var data = new LOGIN_TYPE
                {
                    USER_TYPE = request.UserType,
                    EMP_DESGN = request.EmployeeDesignationCode,
                    STATUS = request.Status,
                    CREATED_ON = DateTime.Now,
                    EMP_DESGN_DESC = request.EmployeeDesignationDescription,
                };
                await dbContext.LOGIN_TYPE.AddAsync(data);
                await dbContext.SaveChangesAsync();
                _logger?.LogInformation($"AddStaffAsync Service, Employee added successfully: {request.EmployeeDesignationCode}");
                _logger?.LogInformation($"AddStaffAsync Service Ended");
                return (true, "Employee added successfully");
            }
            _logger?.LogInformation($"AddStaffAsync Service, Unsupported UserType: {request.UserType}");
            return (false, "Unsupported UserType");
        }

        public async Task<int> GetAllLoginTypeCountAsync()
        {
            _logger?.LogInformation($"GetAllLoginTypeCountAsync Service Started");
            return await dbContext.LOGIN_TYPE.CountAsync();
        }

        public async Task<IEnumerable<LOGIN_TYPE>> GetAllLoginTypesAsync(int? pageNumber = 1, int? pageSize = 100)
        {
            _logger?.LogInformation($"GetAllLoginTypesAsync Service Started, request pageNumber: {pageNumber}, pageSize:{pageSize}");
            var staffLists = dbContext.LOGIN_TYPE.AsQueryable();
            staffLists = staffLists.OrderByDescending(x => x.ID);
            var skipResults = (pageNumber - 1) * pageSize;
            staffLists = staffLists.Skip(skipResults ?? 0).Take(pageSize ?? 100);
            _logger?.LogInformation($"GetAllLoginTypesAsync Service Ended");
            return await staffLists.ToListAsync();
        }
        public async Task<(bool IsSuccess, LOGIN_TYPE? organisations, string? Msg)> GetEmployeeByIdAsync(int id)
        {
            _logger?.LogInformation($"GetEmployeeById Service Started, request id: {id}");
            var response = await dbContext.LOGIN_TYPE.FirstOrDefaultAsync(x => x.ID == id);
            if (response is null)
            {
                _logger?.LogInformation($"GetEmployeeById Service, response is null for id: {id}");
                return (false, null, "Employee Not Exist");
            }
            _logger?.LogInformation($"GetEmployeeById Service Ended, response is : {JsonConvert.SerializeObject(response)}");
            return (true, response, "Employee Exist"); 
        }
        public async Task<IEnumerable<STAFF_ROLES>> GetAllStaffTypesAsync()
        {
            _logger?.LogInformation($"GetAllStaffTypesAsync Service Started");
            return await dbContext.STAFF_ROLES.ToListAsync();
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetStaffDetalsByEmpIdAsync(string empId)
        {
            _logger?.LogInformation($"GetStaffDetalsByEmpIdAsync Service Started, request empId is: {empId} ");
            var employeeId = EncryptoData.DecryptAes(empId);
            var response = await organisationsDbContext.organisations.FirstOrDefaultAsync(x => x.EMP_ID == employeeId);
            if (response is null)
            {
                _logger?.LogInformation($"GetStaffDetalsByEmpIdAsync Service, Employee: {employeeId} Not Exist");
                return (false, null, "Employee Not Exist");
            }

            var jsonResponse = JsonConvert.SerializeObject(response);
            var encryptedResult = EncryptoData.EncryptString(jsonResponse);

            _logger?.LogInformation($"GetStaffDetalsByEmpIdAsync Service Ended");
            return (true, encryptedResult, "Employee Exist");
        }

        public async Task<(bool IsSuccess, string? res, string? Msg)> UpdateEmployeeAsync(int id, string encryptedRequest)
        {
            try
            {
                _logger?.LogInformation($"UpdateEmployeesAsync Service Started, request Id is {id} & status is {encryptedRequest}");
                var response = await dbContext.LOGIN_TYPE.FirstOrDefaultAsync(x => x.ID == id);
                if (response is null)
                    return (false, null, "Not found");
                response.STATUS = encryptedRequest;
                await dbContext.SaveChangesAsync();
                return (true, null, "Update Success");
            }
            catch (Exception ex)
            {
                _logger?.LogInformation($"Exception occurred during UpdateEmployee: {ex}");
                _logger?.LogError(ex.ToString());
                Exception realerror = ex; ;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, ex.Message);
            }
        }
    }
}
