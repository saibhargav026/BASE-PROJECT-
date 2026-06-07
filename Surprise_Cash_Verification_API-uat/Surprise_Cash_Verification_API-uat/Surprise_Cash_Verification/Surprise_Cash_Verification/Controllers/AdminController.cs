using Microsoft.AspNetCore.Mvc;
using Surprise_Cash_Verification.Core.Tables;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.Interface;
using Surprise_Cash_Verification.Models;

namespace Surprise_Cash_Verification.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            this.adminService = adminService;
            this._logger = logger;
        }
        [HttpGet("GetAllLoginTypes")]
        public async Task<IActionResult> GetAllLoginTypes(int? pageNumber, int? pageSize)
        {
            _logger?.LogInformation("GetAllLoginTypes Controller Started");
            var response = await adminService.GetAllLoginTypesAsync(pageNumber, pageSize);
            if (response == null)
            {
                _logger?.LogInformation("GetAllLoginTypes Controller response is null");
                return NotFound();
            }
            return Ok(response);
        }
        [HttpGet("GetEmployeeById/{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            _logger?.LogInformation("GetEmployeeById Controller Started");
            var response = await adminService.GetEmployeeByIdAsync(id);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<LOGIN_TYPE> { status = "success", Message = response.Msg, rData = response.organisations });
            }
            return new JsonResult(new Response<LOGIN_TYPE> { status = "error", Message = response.Msg });
        }
        [HttpGet("UpdateEmployee/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, string encryptedRequest)
        {
            _logger?.LogInformation("UpdateEmployee Controller Started");
            var response = await adminService.UpdateEmployeeAsync(id, encryptedRequest);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", Message = response.Msg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = response.Msg });
        }
        [HttpGet("GetAllStaffTypes")]
        public async Task<IActionResult> GetAllStaffTypes()
        {
            _logger?.LogInformation("GetAllStaffTypes Controller Started");
            var response = await adminService.GetAllStaffTypesAsync();
            if (response is null)
            {
                _logger?.LogInformation("GetAllStaffTypes Controller response is null");
                return NotFound();
            }
            return Ok(response);
        }
        [HttpGet("GetStaffByEmpId")]
        public async Task<IActionResult> GetStaffByEmpId(string empId)
        {
            _logger?.LogInformation("GetStaffByEmpId Controller Started");
            var response = await adminService.GetStaffDetalsByEmpIdAsync(empId);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", Message = response.Msg, rData = response.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = response.Msg });
        }
        [HttpGet("GetAllLoginTypeCount")]
        public async Task<IActionResult> GetAllLoginTypeCount()
        {
            _logger?.LogInformation("GetAllLoginTypeCount Controller Started");
            var response = await adminService.GetAllLoginTypeCountAsync();
            return Ok(response);
        }
        [HttpPost("AddStaff")]
        public async Task<IActionResult> AddStaff(AddStaffRequestDto request)
        {
            _logger?.LogInformation("AddStaff Controller Started");
            var response = await adminService.AddStaffAsync(request);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", Message = response.Message });
            }
            return new JsonResult(new Response<string> { status = "error", Message = response.Message });
        }
    }
}
