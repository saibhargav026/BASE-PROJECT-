using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;
using Surprise_Cash_Verification.Core.DbConn;
using Surprise_Cash_Verification.Core.Tables;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.Interface;
using Surprise_Cash_Verification.Mapper.DTO;
using Surprise_Cash_Verification.Mappers.DTO;
using Surprise_Cash_Verification.Models;

namespace Surprise_Cash_Verification.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SurpriseCashVerificationController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ISurpriseCashVerificationService surpriseCashVerification;
        private readonly ILogger<SurpriseCashVerificationController> _logger;

        public SurpriseCashVerificationController(IConfiguration configuration, ISurpriseCashVerificationService surpriseCashVerification,
            ILogger<SurpriseCashVerificationController> logger)
        {
            this.configuration = configuration;
            this.surpriseCashVerification = surpriseCashVerification;
            _logger = logger;
        }
        //Nomination-DYRH
        [Route("AddAnnexureOneDetails")]
        [HttpPost]
        public IActionResult AddAnnexureOneDetails(SurpriseCashAnnexure1DTO annexureOneDetails)
        {
            _logger?.LogInformation("AddAnnexureOneDetails Controller Started(Nomination-DYRH)");
            var result = surpriseCashVerification.AddAnnexureOneDetails(annexureOneDetails);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<List<int>> { status = "success", rData = result.RefNos, Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        // Branch SCV report-IO
        [Route("AddAnnexureTwoDetails")]
        [HttpPost]
        public IActionResult AddAnnexureTwoDetails(SurpriseCashAnnexure2DTO annexureTwoDetails)
        {
            _logger?.LogInformation("AddAnnexureTwoDetails Controller Started(Branch SCV report-IO)");
            var result = surpriseCashVerification.AddAnnexureTwoDetails(annexureTwoDetails);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure2DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        //Not in use
        [Route("AddAnnexureThreeDetails")]
        [HttpPost]
        public IActionResult AddAnnexureThreeDetails(SurpriseCashAnnexure3DTO annexureThreeDetails)
        {
            var result = surpriseCashVerification.AddAnnexureThreeDetails(annexureThreeDetails);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure3DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }

        [Route("AddAnnexureFourDetails")]
        [HttpPost]
        public IActionResult AddAnnexureFourDetails(SurpriseCashAnnexure4DTO annexureFourDetails)
        {
            _logger?.LogInformation("AddAnnexureFourDetails Controller Started");
            var result = surpriseCashVerification.AddAnnexureFourDetails(annexureFourDetails);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure4DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        //After DYRH login- Discrepancies Report of region
        [Route("GetAnnexureTwoDetailsByRegionCode")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureTwoDetailsByRegionCode(string ReqParameter)
        {
            _logger?.LogInformation("GetAnnexureTwoDetailsByRegionCode Controller Started");
            var result = await surpriseCashVerification.GetAnnexureTwoDetailsByRegionCode(ReqParameter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Discrepancies Report-DYRH,ZO,CO
        [Route("GetAnnexureTwoDetailsByRegionCodeQuater")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureTwoDetailsByRegionCodeQuater(string FinancialYear, string Quater, string ZoneCode, string RegionCode)
        {
            _logger?.LogInformation("GetAnnexureTwoDetailsByRegionCodeQuater Controller Started(Discrepancies Report-DYRH,ZO,CO)");
            var result = await surpriseCashVerification.GetAnnexureTwoDetailsByRegionCodeQuater(FinancialYear, Quater, ZoneCode, RegionCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //ZO-Branch SCV report
        [Route("GetAnnexureTwoDetailsByCO")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureTwoDetailsByCO(string zonecode, string financialYear, string quarter)
        {
            _logger?.LogInformation("GetAnnexureTwoDetailsByCO Controller Started(ZO-Branch SCV report)");
            var result = await surpriseCashVerification.GetAnnexureTwoDetailsByCO(zonecode, financialYear, quarter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Discrepancies Report by Zone & Quater-ZO
        [Route("GetAnnexureTwoDetailsByZoneCode")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureTwoDetailsByZoneCode(string ReqParameter, string? Quater)
        {
            _logger?.LogInformation("GetAnnexureTwoDetailsByZoneCode Controller Started");
            var result = await surpriseCashVerification.GetAnnexureTwoDetailsByZoneCode(ReqParameter, Quater);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Branch SCV report- View(IO,DYRH,BH,ZO,CO)
        [Route("GetAnnexureTwoDetailsByBranchCode")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureTwoDetailsByBranchCode(int ReqParameter)
        {
            _logger?.LogInformation("GetAnnexureTwoDetailsByBranchCode Controller Started-Branch SCV report- View(IO,DYRH,BH,ZO,CO");
            var result = await surpriseCashVerification.GetAnnexureTwoDetailsByBranchCode(ReqParameter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Route("GetAnnexureOneDetails")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureOneDetails(string ReqParameter)
        {
            _logger?.LogInformation("GetAnnexureOneDetails Controller Started");
            var result = await surpriseCashVerification.GetAnnexureOneDetails(ReqParameter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Route("GetRegionDetails")]
        [HttpPost]
        public async Task<IActionResult> GetRegionDetails(string zoneCode)
        {
            var result = await surpriseCashVerification.GetRegionDetails(zoneCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Branch SCV report-IO
        [Route("GetAnnexureOneDetailsByPFno")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureOneDetailsByPFno(string ReqParameter, string financialYear, string quarter)
        {
            _logger?.LogInformation("GetAnnexureOneDetailsByPFno Controller Started-Branch SCV report-IO");
            var result = await surpriseCashVerification.GetAnnexureOneDetailsByPFno(ReqParameter, financialYear, quarter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //BH- Branch SCV report
        [Route("GetAnnexureOneDetailsBySVBranchCode")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureOneDetailsBySVBranchCode(string ReqParameter, string Current, string financialYear, string quarter, string regionCode)
        {
            _logger?.LogInformation("GetAnnexureOneDetailsBySVBranchCode Controller Started-BH- Branch SCV report");
            var result = await surpriseCashVerification.GetAnnexureOneDetailsBySVBranchCode(ReqParameter, Current, financialYear, quarter, regionCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Consolidated Report of RO-DYRH
        [Route("GetApprovedAnnexureTwoDetails")]
        [HttpPost]
        public async Task<IActionResult> GetApprovedAnnexureTwoDetails(string status, string code, string quater, string iszone, string financialYear, string currentUser)
        {
            _logger?.LogInformation("GetApprovedAnnexureTwoDetails Controller Started-Consolidated Report of RO-DYRH");
            var result = await surpriseCashVerification.GetApprovedAnnexureTwoDetails(status, code, quater, iszone, financialYear, currentUser);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Route("GetAnnexureThreeDetails")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureThreeDetails(string status, string code, string iszone)
        {
            _logger?.LogInformation("GetAnnexureThreeDetails Controller Started");
            var result = await surpriseCashVerification.GetAnnexureThreeDetails(status, code, iszone);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Route("GetAnnexureFiveDetails")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureFiveDetails()
        {
            _logger?.LogInformation("GetAnnexureFiveDetails Controller Started");
            var result = await surpriseCashVerification.GetAnnexureFiveDetails();
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //not there
        [Route("GetAnnexureFourDetails")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureFourDetails(string status, string code)
        {
            _logger?.LogInformation("GetAnnexureFourDetails Controller Started");
            var result = await surpriseCashVerification.GetAnnexureFourDetails(status, code);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Consolidated Report of Zonal Office-ZO,CO(Approved-Status)
        [Route("GetApprovedAnnexureFourDetails")]
        [HttpPost]
        public async Task<IActionResult> GetApprovedAnnexureFourDetails(string status, string zonecode, string iszone, string year, string quater)
        {
            _logger?.LogInformation("GetApprovedAnnexureFourDetails Controller Started-Consolidated Report of Zonal Office-ZO,CO(Approved-Status)");
            var result = await surpriseCashVerification.GetApprovedAnnexureFourDetails(status, zonecode, iszone, year, quater);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Route("AddComment")]
        [HttpPost]
        public IActionResult AddComment(CommentDTO commentDTO)
        {
            _logger?.LogInformation("AddComment Controller Started");
            var result = surpriseCashVerification.AddComment(commentDTO);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<CommentDTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        //DYRH Approve
        [Route("AddApproved")]
        [HttpPost]
        public IActionResult AddApproved(ApprovedDTO approvedDTO)
        {
            _logger?.LogInformation("AddApproved Controller Started");
            var result = surpriseCashVerification.AddApproved(approvedDTO);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure2DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        //BH Complied,NotComplied
        [Route("AddBranchComplied")]
        [HttpPost]

        public IActionResult AddBranchComplied(BranchCompliedDTO branchCompliedDTO)
        {
            _logger?.LogInformation("AddBranchComplied Controller Started-BH Complied,NotComplied");
            var result = surpriseCashVerification.AddBranchComplied(branchCompliedDTO);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure2DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        //DYRH-AddROComplied, AddRONotComplied
        [Route("AddROComplied")]
        [HttpPost]

        public IActionResult AddROComplied(ROCompliedDTO roCompliedDTO)
        {
            _logger?.LogInformation("AddROComplied Controller Started-DYRH-AddROComplied, AddRONotComplied");
            var result = surpriseCashVerification.AddROComplied(roCompliedDTO);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure2DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        //AddZOComplied, AddZONotComplied
        [Route("AddZOComplied")]
        [HttpPost]
        public IActionResult AddZOComplied(ZOCompliedDTO zoCompliedDTO)
        {
            _logger?.LogInformation("AddZOComplied Controller Started-AddZOComplied, AddZONotComplied");
            var result = surpriseCashVerification.AddZOComplied(zoCompliedDTO);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure2DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }

        //AddCOComplied, AddCONotComplied
        [Route("AddCOComplied")]
        [HttpPost]
        public IActionResult AddCOComplied(COCompliedDTO coCompliedDTO)
        {
            _logger?.LogInformation("AddCOComplied Controller Started-AddCOComplied, AddCONotComplied");
            var result = surpriseCashVerification.AddCOComplied(coCompliedDTO);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<SurpriseCashAnnexure2DTO> { status = "success", Message = result.ErrorMsg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.ErrorMsg });
        }
        //Branch SCV report-DYRH
        [Route("GetAnnexureTwoDetailsByPFNo")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureTwoDetailsByPFNo(string ReqParameter, string financialYear, string quarter, string regionCode, string regionName)
        {
            _logger?.LogInformation("GetAnnexureTwoDetailsByPFNo Controller Started-Branch SCV report-DYRH");
            var result = await surpriseCashVerification.GetAnnexureTwoDetailsByPFNo(ReqParameter, financialYear, quarter, regionCode,regionName);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Branch SCV report-CO
        [Route("GetAnnexureTwoDetailsCO")]
        [HttpPost]
        public async Task<IActionResult> GetAnnexureTwoDetailsCO(string financialYear, string quarter)
        {
            _logger?.LogInformation("GetAnnexureTwoDetailsCO Controller Started-Branch SCV report-CO");
            var result = await surpriseCashVerification.GetAnnexureTwoDetailsCO(financialYear, quarter);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Route("GetAllAnnexureOneData")]
        [HttpGet]
        public async Task<IActionResult> GetAllAnnexureOneData(string currentYear, string currentQuarter, string regionCode)
        {
            _logger?.LogInformation("GetAllAnnexureOneData Controller Started");
            var result = await surpriseCashVerification.GetAllAnnexureOneData(currentYear, currentQuarter, regionCode);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", rData = result.organisations });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }

        [Route("DeleteAnnexureOneData")]
        [HttpGet]
        public async Task<IActionResult> DeleteAnnexureOneData(int RefNo, string userid)
        {
            _logger?.LogInformation("DeleteAnnexureOneData Controller Started");
            var result = await surpriseCashVerification.DeleteAnnexureOneData(RefNo, userid);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", Message = result.Msg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        //Branch SCV report -DYRH
        [Route("DeleteAnnexureTwoData")]
        [HttpGet]
        public async Task<IActionResult> DeleteAnnexureTwoData(int RefNo, string userid)
        {
            _logger?.LogInformation("DeleteAnnexureTwoData Controller Started");
            var result = await surpriseCashVerification.DeleteAnnexureTwoData(RefNo, userid);
            if (result.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", Message = result.Msg });
            }
            return new JsonResult(new Response<string> { status = "error", Message = result.Msg });
        }
        [HttpGet("GetLatestSurpriseDate")]
        public async Task<IActionResult> GetLatestSurpriseDate(string svBranchCode)
        {
            var response = await surpriseCashVerification.GetLatestSurpriseDateAsync(svBranchCode);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<string> { status = "success", Message = response.Message, rData = response.FormattedDate });
            }
            return new JsonResult(new Response<string> { status = "error", Message = response.Message, rData = response.FormattedDate });
        }

        [HttpPost("GetDenominationsCashDetails")]
        public async Task<IActionResult> GetDenominationsCashDetails([FromBody] CashRequest request)
        {
            _logger?.LogInformation("CashDetails Controller Started");
            var response = await surpriseCashVerification.GetDenominationsCashDetails(request);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<CashDetails> { status = "success", Message = response.Msg, rData = response.cashData });
            }
            return new JsonResult(new Response<CashDetails> { status = "error", Message = response.Msg });
        }
        [HttpGet("GetLogInType")]
        public async Task<IActionResult> GetLogInType(string emp_desgn)
        {
            _logger?.LogInformation("GetLogInType Controller Started");
            var response = await surpriseCashVerification.GetLogInTypeAsync(emp_desgn);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<LOGIN_TYPE> { status = "success", Message = response.Msg, rData = response.organisations });
            }
            return new JsonResult(new Response<LOGIN_TYPE> { status = "error", Message = response.Msg });
        }

        [HttpGet("GetCOLogIn")]
        public async Task<IActionResult> GetCOLogIn(string location, string emp_id)
        {
            _logger?.LogInformation("GetLogInType Controller Started");
            var response = await surpriseCashVerification.GetCOLogInAsync(location, emp_id);
            if (response.IsSuccess)
            {
                return new JsonResult(new Response<LOGIN_TYPE> { status = "success", Message = response.Msg, rData = response.organisations });
            }
            return new JsonResult(new Response<LOGIN_TYPE> { status = "error", Message = response.Msg });
        }
    }
}
