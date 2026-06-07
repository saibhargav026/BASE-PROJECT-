using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.Interface;
using Surprise_Cash_Verification.Mappers.DTO;
using Surprise_Cash_Verification.Models;

namespace Surprise_Cash_Verification.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserManagementServices userManagementServices;
        private readonly IConfiguration configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IUserManagementServices userManagementServices, IConfiguration configuration, IHttpContextAccessor httpContextAccessor,
            ILogger<AccountController> logger)
        {
            this.userManagementServices = userManagementServices;
            this.configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            this._logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestions()

        {
            _logger?.LogInformation("GetQuestions Controller started");
            var result = await userManagementServices.GetQuestions();
            if (result.IsSuccess)
            {
                _httpContextAccessor.HttpContext.Session.SetString("Answer", result.answer);

                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> validateDomainUser(UserRequest request)
        {
            _logger?.LogInformation("validateDomainUser Controller started");
            string answer = _httpContextAccessor.HttpContext.Session.GetString("Answer");
            var result = await userManagementServices.validateUser(request, answer);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.userDetails });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetStaffDetailsAfterLogin(string ReqParameter)
        {
            var result = await userManagementServices.GetStaffDetailsAfterLogin(ReqParameter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //getting Login user StaffDetails based on empid
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetStaffDetails(string ReqParameter)
        {
            _logger?.LogInformation("GetStaffDetails Controller started");
            var result = await userManagementServices.GetStaffDetails(ReqParameter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //DYRH for getting branches for the dropdown
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetBranchByZoneRegion(string zoneCode, string regionCode)
        {
            var result = await userManagementServices.GetBranchByZoneRegion(zoneCode, regionCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<Branch_master> { status = "success", Data = result.branch.ToList() });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //GetUnNominatedBranches-DYRH
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetUnNominatedBranches(string FinancialYear, string Quarter, string RegionCode, string DivisionCode)
        {
            _logger?.LogInformation("GetUnNominatedBranches Controller started-DYRH");
            var result = await userManagementServices.GetUnNominatedBranches(FinancialYear, Quarter, RegionCode, DivisionCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<Branch_master> { status = "success", Data = result.branch.ToList() });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureFourUsers()
        {
            var result = await userManagementServices.GetAnnexureFourUsers();
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetBranchByBrCode(string brCode)
        {
            var result = await userManagementServices.GetBranchByBrCode(brCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<Branch_master> { status = "success", rData = result.branchDetails });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetBranchDetailsByRegion(BranchEmpDetailsModel branchEmpDetails)
        {
            var result = await userManagementServices.GetBranchDetailsByRegion(branchEmpDetails.RegionCode, branchEmpDetails.BranchCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<StaffDetails> { status = "success", Data = result.branchDetails.ToList() });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        [HttpGet]
        public async Task<IActionResult> LogOut(string userId)
        {
            var result = await userManagementServices.Logout(userId);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", Message = result.Msg });
            }
            return new JsonResult(new Response<string> { status = "false", Message = result.Msg });
        }

        [HttpPost]
        public async Task<IActionResult> MyDairyDecrypt([FromBody] MyDairyDecryptRequestDto request)
        {
            _logger?.LogInformation($"MyDairyDecrypt Controller started, request Object is {JsonConvert.SerializeObject(request)}");
            if (string.IsNullOrWhiteSpace(request.EncryptedText))
            {
                _logger?.LogInformation($"MyDairyDecrypt Controller, Encrypted text {request.EncryptedText} cannot be empty.");
                return BadRequest("Encrypted text cannot be empty.");
            }

            string API_URL = configuration["MyDairy:url"];
            _logger?.LogInformation($"MyDairyDecrypt Controller, MyDairy deccrypt text url {API_URL}.");

            var url = API_URL;
            using var client = new HttpClient();
            var data = request.EncryptedText.Replace(" ", "+");
            _logger?.LogInformation($"MyDairyDecrypt Controller, Encrypted text request is {data}.");
            var jsonData = JsonContent.Create(new { encryptedText = data });

            var response = await client.PostAsync(url, jsonData);
            var result = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger?.LogInformation($"MyDairyDecrypt Controller, Error calling decrypt API: {response}");
                return StatusCode((int)response.StatusCode, $"Error calling decrypt API: {response}");
            }

            _logger?.LogInformation($"MyDairyDecrypt Controller, Success response is {result}");
            return Ok(result);


        }
    }
}
