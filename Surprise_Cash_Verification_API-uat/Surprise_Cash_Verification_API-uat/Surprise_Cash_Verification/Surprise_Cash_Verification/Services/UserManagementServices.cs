using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using OnlineAcOpening.Interface;
using Surprise_Cash_Verification.Core.DbConn;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.DbConn;
using Surprise_Cash_Verification.Interface;
using Surprise_Cash_Verification.Mappers.DTO;
using Surprise_Cash_Verification.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;

namespace Surprise_Cash_Verification.Services
{
    public class UserManagementServices : IUserManagementServices
    {
        private readonly ILogger<UserManagementServices> logger;
        private readonly IConfiguration configuration;
        private readonly OrganisationsDbContext organisationsDb;
        private readonly SurpriseCashDbContext dbContext;

        public UserManagementServices(ILogger<UserManagementServices> logger, IConfiguration configuration, OrganisationsDbContext organisationsDb, SurpriseCashDbContext dbContext)
        {
            this.logger = logger;
            this.configuration = configuration;
            this.organisationsDb = organisationsDb;
            this.dbContext = dbContext;
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetStaffDetailsAfterLogin(string ReqParameter)
        {
            var ds = EncryptoData.DecryptAes(ReqParameter);
            //var ds = ReqParameter;
            ReqParameter = ds;
            var staffdetails = await organisationsDb.organisations.Where(x => x.EMP_ID == ds).FirstOrDefaultAsync();
            if (staffdetails != null)
            {
                //User_Details u = new User_Details();
                //u.User = staffdetails;

                ////JWT
                //var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                //var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                //var Sectoken = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Issuer"], null,
                //    expires: DateTime.Now.AddMinutes(120), signingCredentials: credentials);
                //var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
                //u.token = token;

                //string resobjJson = JsonConvert.SerializeObject(u);
                string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                string res = EncryptoData.EncryptString(staffDetailsJson);
                return (true, res, null);
            }
            else
            {
                return (false, null, "No record Found");
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetStaffDetails(string ReqParameter)
        {
            try
            {
                logger.LogInformation("GetStaffDetails Service Started.");
                var ds = EncryptoData.DecryptAes(ReqParameter);
                var dec_des_result = JsonConvert.DeserializeObject<dynamic>(ds);


                string empId = dec_des_result.User.user_id;
                logger.LogInformation($"GetStaffDetails Service decrypted EMP_ID: {empId}");

                var staffdetails = await organisationsDb.organisations.Where(x => x.EMP_ID == empId).FirstOrDefaultAsync();
                if (staffdetails != null)
                {
                    staffdetails.EMP_ID = EncryptoData.EncryptString(empId);

                    //User_Details u = new User_Details();
                    //u.User = staffdetails;

                    ////JWT
                    //var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                    //var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                    //var Sectoken = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Issuer"], null,
                    //    expires: DateTime.Now.AddMinutes(120), signingCredentials: credentials);
                    //var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
                    //u.token = token;

                    //string resobjJson = JsonConvert.SerializeObject(u);
                    var query = $@"select * from STAFF_DETAILS where region_code in
                    (select region_code from STAFF_DETAILS as s2 where emp_id='{empId}') and emp_desgn_desc like '%REGIONAL HEAD%'";
                    var regionalHeadData = await organisationsDb.Set<StaffDetails>().FromSqlRaw(query).FirstOrDefaultAsync();
                    logger.LogInformation("GetStaffDetails Service Executed regionalHead query");

                    var regionalHead = regionalHeadData?.EMP_NAME;
                    var responseDto = new StaffDetailsDto
                    {
                        StaffDetails = staffdetails,
                        RegionalHead = regionalHead,
                    };
                    string staffDetailsJson = JsonConvert.SerializeObject(responseDto);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger.LogInformation("GetStaffDetails Service Ended Successfully");
                    return (true, res, null);
                }
                else
                {
                    logger.LogInformation($"GetStaffDetails Service, No StaffDetails found for EMP_ID: {empId}");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger.LogInformation($"Exception Occurred in GetStaffDetails Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureFourUsers()
        {
            try
            {
                var staffdetails = await organisationsDb.organisations.Where(x => x.LOCATION == "100000").ToListAsync();
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    return (true, res, null);
                }
                else
                {
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? answer, string? Msg)> GetQuestions()
        {
            try
            {
                logger?.LogInformation("GetQuestions Service started.");
                var questiondetails = await organisationsDb.login_question.OrderBy(q => Guid.NewGuid()).FirstOrDefaultAsync();
                //var query = "select * from Questions  where Answer in ('10')";
                //var questiondetails = await organisationsDb.login_question.FromSqlRaw(query).FirstOrDefaultAsync();
                if (questiondetails != null)
                {
                    logger?.LogInformation("Question retrieved successfully.");
                    string answer = questiondetails.Answer;

                    string questionDetailsJson = JsonConvert.SerializeObject(questiondetails);
                    logger?.LogInformation("Serialized question details.");
                    string res = EncryptoData.EncryptString(questionDetailsJson);
                    logger?.LogInformation("Question details encrypted successfully & GetQuestions Service Ended.");
                    return (true, res, answer, null);
                }
                else
                {
                    logger?.LogInformation("No record Found, response null");
                    return (false, null, "", "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"An error occurred in GetQuestions Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", "", realerror.Message);
            }
        }
        public async Task<(bool IsSuccess, string? userDetails, string? ErrorMsg)> validateUser(UserRequest request, string answer)
        {
            UserDetails? resobj = new UserDetails();

            bool validate = false;
            try
            {
                logger?.LogInformation("validateUser Service started");
                var ds = EncryptoData.DecryptAes(request.user_id);
                request.user_id = ds;
                var ds1 = EncryptoData.DecryptAes(request.ps);
                request.ps = ds1;
                if (request.captcha != null)
                {
                    var ds2 = EncryptoData.DecryptAes(request.captcha);
                    request.captcha = ds2;
                    logger?.LogInformation($"Decrypted user_id: {request.user_id}");
                    if (ds2 == answer)
                    {
                        logger?.LogInformation($"Captcha validation passed for user: {request.user_id}");
                        string AD_API_URL = configuration["ApiKey:AD_API_URL"];
                        string M_service_Name = configuration["ApiKey:M_service_Name"];
                        string M_Service_Pwd = configuration["ApiKey:M_Service_Pwd"];
                        string adminUserId = configuration["ApiKey:ADMIN_USER_ID"];
                        string pwd = configuration["ApiKey:PWD"];


                        var data = new
                        {
                            user_id = request.user_id,
                            password = request.ps
                        };
                        if (request.user_id == EncryptoData.DecryptAes(adminUserId) && request.ps == EncryptoData.DecryptAes(pwd))
                        {
                            validate = true;
                            return await ValidationCheck(validate, request.user_id, "true");
                        }
                        else
                        {
                            JsonContent jsonData = JsonContent.Create(data);
                            HttpClient client = new HttpClient();
                            var byteArray = Encoding.ASCII.GetBytes(M_service_Name + ":" + M_Service_Pwd);
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
                            logger?.LogInformation("Sending request to AD API for user validation.");
                            HttpResponseMessage response = await client.PostAsync(AD_API_URL + "/validateDomainUser", jsonData);
                            HttpContent content = response.Content;
                            var result = await content.ReadAsStringAsync();
                            logger?.LogInformation("Received response from AD API.");
                            resobj = JsonConvert.DeserializeObject<UserDetails>(result);
                            validate = (resobj?.validation_status) == "true" ? true : false;
                            validate = true;
                            return await ValidationCheck(validate, request.user_id, resobj?.validation_status);
                        }
                    }
                    else
                    {
                        logger?.LogInformation($"Captcha mismatch for user: {request.user_id}, Please enter correct captcha.");
                        await GetQuestions();
                        return (false, null, "Please enter correct captcha.");
                    }
                }
                //mydairy will use this logic
                else
                {
                    logger?.LogInformation($"Login was done through MyDairy");
                    string adminUserId = configuration["ApiKey:ADMIN_USER_ID"];
                    string pwd = configuration["ApiKey:PWD"];

                    if (request.user_id == EncryptoData.DecryptAes(adminUserId) && request.ps == EncryptoData.DecryptAes(pwd))
                    {
                        validate = true;
                        return await ValidationCheck(validate, request.user_id, "true");
                    }
                    else
                    {
                        validate = true;
                        return await ValidationCheck(validate, request.user_id, "true");
                    }
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Exception occurred during user validation in validateUser Service: {ex}");
                validate = false;
                logger?.LogError(ex.ToString());
                Exception realerror = ex; ;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, ex.Message);

            }
        }

        private async Task<(bool IsSuccess, string? userDetails, string? ErrorMsg)> ValidationCheck(bool validate, string userId, string validation_status)
        {
            if (validate == true)
            {
                logger?.LogInformation("User validated successfully: {UserId}", userId);
                User_Details1 ud = new User_Details1();

                //JWT
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var Sectoken = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Issuer"], null,
                    expires: DateTime.Now.AddMinutes(120), signingCredentials: credentials);
                var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

                ud.token = token;

                var userDetails = new User_Details
                {
                    User = new User_Details1
                    {
                        user_id = userId,
                        //validation_status = validation_status,
                        validation_status = "true",
                        token = token
                    },
                    token = token
                };
                USER_TOKEN ut = new USER_TOKEN();
                ut.LASTTOKEN = userDetails.token;
                ut.USERID = EncryptoData.EncryptString(userId);
                var isUserLogin = InsertToken(ut);
                logger?.LogInformation($"InsertToken status: {isUserLogin.status}");
                if (isUserLogin.status)
                {
                    logger?.LogWarning("Previous session exists, Please Clear for user: {UserId}", userId);
                    return (false, null, "Please Clear previous Session then try to login again");
                }
                else
                {
                    string resobjJson = JsonConvert.SerializeObject(userDetails, Formatting.Indented);
                    string res = EncryptoData.EncryptString(resobjJson);
                    logger?.LogInformation("User details encrypted successfully.");
                    //string res = data.user_id;
                    //var query = "select * from STAFF_DETAILS  where EMP_DESGN in ('4206','4254','4255','5101','5106','5254','5255') and LOCATION_DESC like 'RO -%' and EMP_ID = '" + request.user_id + "'";
                    var query = "select * from STAFF_DETAILS  where EMP_DESGN in ('4206','4254','4255','5101','5106','5254','5255') and LOCATION_DESC like 'RO -%'";
                    var staffdetails = await organisationsDb.organisations.FromSqlRaw(query).FirstOrDefaultAsync();
                    var branchAccess = await dbContext.BranchUserAccess.Where(x => x.BRANCH_USERID == userId).FirstOrDefaultAsync();
                    if (staffdetails != null || branchAccess != null)
                    {
                        logger?.LogInformation("validateUser Service Ended with Success");
                        return (true, res, null);
                    }
                    else
                    {
                        return (false, null, "You are Not Authorize To Access");
                    }
                }
            }

            else
            {
                logger?.LogInformation($"User validation failed for user: {userId}, Please check username and credentials.");
                await GetQuestions();
                return (false, null, "Please check username and credentials.");
            }
        }
        public async Task<(bool IsSuccess, List<Branch_master>? branch, string? Msg)> GetBranchByZoneRegion(string zoneCode, string regionCode)
        {
            try
            {
                var branchList = await organisationsDb.Branch_master.Where(x => x.ZONE_CODE == zoneCode && x.REGION_CODE == regionCode).ToListAsync();
                if (branchList != null)
                {
                    return (true, branchList, null);
                }
                else
                {
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, List<Branch_master>? branch, string? Msg)> GetUnNominatedBranches(string FinancialYear, string Quarter, string RegionCode, string DivisionCode)
        {
            try
            {
                logger?.LogInformation($"GetUnNominatedBranches Service Started FINANCIAL_YEAR:{FinancialYear}, QUATER:{Quarter}, REGION_CODE:{RegionCode}, ZONE_CODE:{DivisionCode}");
                var annexureBranches = await dbContext.SurpriseCashAnnexureOne.Where(a => a.FINANCIAL_YEAR == FinancialYear && a.QUATER == Quarter).Select(a => a.SV_BRANCH_CODE.Trim()).ToListAsync();
                var nominatedBranches = JsonConvert.SerializeObject(annexureBranches);

                var allBranches = await organisationsDb.Branch_master.Where(x => x.REGION_CODE == RegionCode && x.ZONE_CODE == DivisionCode).ToListAsync();

                var unNominatedBranch = allBranches.Where(x => !nominatedBranches.Contains(x.BRANCH_CODE)).ToList();
                //var unNominatedBranch = await organisationsDb.Branch_master.Where(x => (!nominatedBranches.Contains(x.BRANCH_CODE)) && x.REGION_CODE == RegionCode && x.ZONE_CODE == DivisionCode).ToListAsync();

                logger?.LogInformation($"GetUnNominatedBranches Service unNominatedBranch count:{unNominatedBranch.Count()}");
                //var unNominatedBranch = await organisationsDb.Branch_master.Where(b => !annexureBranches.Contains(b.BRANCH_CODE.Trim()) && b.REGION_CODE == RegionCode && b.ZONE_CODE == DivisionCode).ToListAsync();
                if (unNominatedBranch != null)
                {
                    logger?.LogInformation($"GetUnNominatedBranches Service Ended");
                    return (true, unNominatedBranch, null);
                }
                else
                {
                    logger?.LogInformation($"GetUnNominatedBranches Service, No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in GetUnNominatedBranches Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, Branch_master? branchDetails, string? Msg)> GetBranchByBrCode(string brCode)
        {
            try
            {
                var branchList = await organisationsDb.Branch_master.Where(x => x.BRANCH_CODE == brCode).FirstOrDefaultAsync();
                if (branchList != null)
                {
                    return (true, branchList, null);
                }
                else
                {
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }
        public async Task<(bool IsSuccess, List<StaffDetails>? branchDetails, string? Msg)> GetBranchDetailsByRegion(string REGION_CODE, string BR_CODE)
        {
            try
            {
                string currentDate = DateTime.Now.AddYears(-2).ToString();

                var branchDetailList = await organisationsDb.organisations.Where(x => x.BR_CODE == BR_CODE).ToListAsync();
                if (branchDetailList != null)
                {
                    return (true, branchDetailList, null);
                }
                else
                {
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public (bool status, string token) InsertToken(USER_TOKEN user)
        {
            logger.LogInformation($"Entered: InsertToken: {user.USERID}");
            var check_user = dbContext.USER_TOKEN.Where(u => u.USERID == user.USERID).FirstOrDefault();
            logger.LogInformation($"USER_TOKEN response: {check_user}");

            if (check_user != null)
            {
                return (true, check_user.LASTTOKEN);
            }
            else
            {

                user.HASH_TOKEN = ComputeSha256Hash(user.LASTTOKEN);
                dbContext.USER_TOKEN.Add(user);
                dbContext.SaveChanges();
                return (false, null);
            }
        }
        public string ComputeSha256Hash(string token)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
                return Convert.ToBase64String(bytes);
            }
        }
        public async Task<USER_TOKEN> GetUserByIdAsync(string userId)
        {
            var user = dbContext.USER_TOKEN.Where(u => u.USERID == EncryptoData.EncryptString(userId)).FirstOrDefault();
            if (user is not null)
                return user;
            return null;
        }
        public async Task<(bool IsSuccess, string? Msg)> Logout(string userId)
        {
            try
            {
                var user = await GetUserByIdAsync(userId);
                if (user != null)
                {
                    user.LASTTOKEN = null;
                    var records_toRemove = dbContext.USER_TOKEN.FirstOrDefault(e => e.USERID.Contains(EncryptoData.EncryptString(userId)));//Where(e => e.USERID.Contains(userId)).ToList();
                    dbContext.USER_TOKEN.Remove(records_toRemove);
                    dbContext.SaveChanges();
                    return (true, "Logout sucessfully");
                }
                else
                {
                    return (false, $"No Data found for the User {userId}");
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, realerror.Message);

            }
        }
    }
}
