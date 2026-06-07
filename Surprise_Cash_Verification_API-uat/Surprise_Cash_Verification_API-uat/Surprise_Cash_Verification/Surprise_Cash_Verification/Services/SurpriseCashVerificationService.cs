using AutoMapper;
using Azure;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OnlineAcOpening.Interface;
using Surprise_Cash_Verification.Core.DbConn;
using Surprise_Cash_Verification.Core.Tables;
using Surprise_Cash_Verification.Core.Tables.Master;
using Surprise_Cash_Verification.DbConn;
using Surprise_Cash_Verification.Interface;
using Surprise_Cash_Verification.Mapper.DTO;
using Surprise_Cash_Verification.Models;
using System;
using System.Globalization;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Xml;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Surprise_Cash_Verification.Services
{
    public class SurpriseCashVerificationService : ISurpriseCashVerificationService
    {
        private readonly SurpriseCashDbContext dbContext;
        private readonly OrganisationsDbContext organisationsDb;
        private readonly ILogger<SurpriseCashVerificationService> logger;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;
        public SurpriseCashVerificationService(ILogger<SurpriseCashVerificationService> logger, IMapper mapper, IConfiguration configuration, SurpriseCashDbContext dbContext, OrganisationsDbContext organisationsDb)
        {
            this.dbContext = dbContext;
            this.organisationsDb = organisationsDb;
            this.logger = logger;
            this.mapper = mapper;
            this.configuration = configuration;
        }

        public (int Year, int Quarter) GetPreviousQuarter()
        {
            DateTime currentDate = DateTime.Now;
            int currentYear = currentDate.Year;
            int currentMonth = currentDate.Month;

            int currentQuarter = (currentMonth - 1) / 3 + 1;
            int previousQuarter = currentQuarter - 1;

            if (previousQuarter == 0)
            {
                return (currentYear - 1, 4);
            }

            return (currentYear, previousQuarter);
        }

        public string GetPreviousFinancialYear()
        {
            DateTime currentDate = DateTime.Now;
            int currentYear = currentDate.Year;
            int previousYear = currentYear - 1;

            if (currentDate.Month < 4)
            {
                return $"{previousYear - 1}-{previousYear}";
            }
            else
            {
                return $"{previousYear}-{currentYear}";
            }
        }

        public bool IsValidQuarterAndYear(string financialYear, string quarter, string branch_pfno, string SVBranchCode)
        {

            var currentQuaterNumber = ConvertQuaterToNumber(quarter);
            if (currentQuaterNumber <= 1)
            {
                return true; //no previous quater in the financial year
            }
            //calculate previous quater
            var previousQuater = "Q" + (currentQuaterNumber - 1);
            var isDeletedStatusYes = dbContext.SurpriseCashAnnexureOne.FirstOrDefault(e => e.FINANCIAL_YEAR == financialYear && e.QUATER == previousQuater + ""
            && e.BRANCH_PFNO == branch_pfno && e.SV_BRANCH_CODE == SVBranchCode && e.IS_DELETED == "Y");
            if (isDeletedStatusYes != null)
            {
                return true;
            }
            var existInPreviousQuater = dbContext.SurpriseCashAnnexureOne.FirstOrDefault(e => e.FINANCIAL_YEAR == financialYear && e.QUATER == previousQuater + ""
            && e.BRANCH_PFNO == branch_pfno && e.SV_BRANCH_CODE == SVBranchCode);

            //var years = financialYear.Split('-');
            //if (years.Length != 2) return false;

            //int startYear = int.Parse(years[0]);
            //int endYear = int.Parse(years[1]);

            //switch(quarter)
            //{
            //    case "Q1":
            //        return DateTime.Now.Year == endYear;
            //    case "Q2":
            //        return DateTime.Now.Year == startYear;
            //    case "Q3":
            //        return DateTime.Now.Year == endYear;
            //    case "Q4":
            //        return DateTime.Now.Year == endYear;
            //    default:
            //        return false;
            //}
            return existInPreviousQuater == null;
        }
        private int ConvertQuaterToNumber(string quater)
        {
            return quater switch
            {
                "Q1" => 1,
                "Q2" => 2,
                "Q3" => 3,
                "Q4" => 4,
                _ => 0,
            };
        }
        private (string previousQuater, bool isSameFinancialYear) GetPreviousQuater(string currentQuater)
        {
            switch (currentQuater)
            {
                case "Q1":
                    return ("Q4", false);//Q4 is previous financial year
                case "Q2":
                    return ("Q1", true);
                case "Q3":
                    return ("Q2", true);
                case "Q4":
                    return ("Q3", true);
                default:
                    return ("", true);
            }
        }

        public (bool IsSuccess, List<int> RefNos, string? ErrorMsg) AddAnnexureOneDetails(SurpriseCashAnnexure1DTO annexureOneDetails)
        {
            logger?.LogInformation("AddAnnexureOneDetails Service Started(Nomination-DYRH)");
            using var transaction = dbContext.Database.BeginTransaction();
            try
            {
                var msg = "";
                var FullIoBranchCode = "";
                var value = configuration.GetValue<string>("GetYears:YearsQuaterValue");
                var BranchEmpId = "";
                var BranchOfficierName = "";
                var BranchOfficierDesignation = "";
                var BranchOfficierBranchName = "";
                List<string> nominatedSVBranches = new List<string>();
                List<int> insertedrefNos = new List<int>();
                List<string> apiUrls = new List<string>();

                logger?.LogInformation("GetYears:YearsQuaterValue " + value);
                logger?.LogInformation($"AddAnnexureOneDetails Service Started request object is: {JsonConvert.SerializeObject(annexureOneDetails)}");
                for (int i = 0; i < annexureOneDetails.newBranches.Count; i++)
                {
                    var item = annexureOneDetails.newBranches[i];
                    var officer = annexureOneDetails.officers[i];

                    var SVBranchCode = item.SvBranchCode.Split('-')[0];
                    var IoBranchCode = item.IoBranchCode.Split('-')[0];
                    var SVBranchCode2 = item.SvBranchCode.Split('-')[1];
                    FullIoBranchCode = item.IoBranchCode;
                    var FinancialYear = annexureOneDetails.FinancialYear;
                    var regionName = annexureOneDetails.FromRegionName;
                    var regionCode = annexureOneDetails.RegionCode;
                    BranchEmpId = officer.BranchEmpId;
                    BranchOfficierName = officer.ToBranchOfficierName;
                    BranchOfficierDesignation = officer.ToBranchOfficierDesignation;
                    BranchOfficierBranchName = officer.ToBranchOfficierBranchName;
                    if (!IsValidQuarterAndYear(FinancialYear, annexureOneDetails.Quater, BranchEmpId, SVBranchCode))
                    {
                        msg = "Same officer should not be nominated to same branch for two consecutive quarter.";
                        return (false, null, msg);
                    }
                    var exist = dbContext.SurpriseCashAnnexureOne.FirstOrDefault(e => e.FINANCIAL_YEAR == FinancialYear && e.QUATER == annexureOneDetails.Quater && e.TO_BRANCH_OFFICER_NAME == BranchOfficierName && e.SV_BRANCH_CODE == SVBranchCode && e.IS_DELETED == "N");
                    if (exist != null)
                    {
                        msg = "Already nominated to Branch Officier with this financial year and quarter.";
                        return (false, null, msg + BranchOfficierName);
                    }
                    else
                    {
                        var (previousYear1, previousQuarter) = GetPreviousQuarter();
                        string previousYear = GetPreviousFinancialYear();
                        var checkPreviousExist = dbContext.SurpriseCashAnnexureOne.FirstOrDefault(e => e.FINANCIAL_YEAR == previousYear && e.QUATER == "Q" + previousQuarter + "" && e.TO_BRANCH_OFFICER_NAME == BranchOfficierName && e.SV_BRANCH_CODE == SVBranchCode && e.IS_DELETED == "N");
                        if (checkPreviousExist != null)
                        {
                            msg = "The provided quarter does not match the financial year.";
                            return (false, null, msg + BranchOfficierName);
                        }
                        else
                        {
                            var res = mapper.Map<SurpriseCashAnnexure1DTO, SURPRISE_CASH_ANNEXURE_1>(annexureOneDetails);
                            res.SV_BRANCH_CODE = SVBranchCode;
                            res.IO_BRANCH_CODE = IoBranchCode;
                            res.CREATED_BY = annexureOneDetails.LoggedUserId;
                            res.CREATED_ON = DateTime.Now;
                            res.UNIQUE_ID = Guid.NewGuid().ToString("N");
                            res.BRANCH_PFNO = BranchEmpId;
                            res.IS_DELETED = "N";
                            res.TO_BRANCH_OFFICER_NAME = BranchOfficierName;
                            res.TO_BRANCH_OFFICER_DESIGNATION = BranchOfficierDesignation;
                            res.TO_BRANCH_OFFICER_BRANCH_NAME = BranchOfficierBranchName;
                            dbContext.SurpriseCashAnnexureOne.AddRange(res);
                            dbContext.SaveChanges();
                            if (res != null)
                            {
                                SURPRISE_CASH_ANNEXURE_2 Surprise_cash_annexure_2 = new SURPRISE_CASH_ANNEXURE_2();
                                Surprise_cash_annexure_2.REF_NO = res.REF_NO;
                                Surprise_cash_annexure_2.NAME_OF_INSPECTING_OFFICER = BranchOfficierName;
                                Surprise_cash_annexure_2.NAME_OF_BRANCH = SVBranchCode2;
                                Surprise_cash_annexure_2.CREATED_BY = annexureOneDetails.LoggedUserId;
                                Surprise_cash_annexure_2.CREATED_ON = DateTime.Now;
                                Surprise_cash_annexure_2.SV_BRANCH_CODE = SVBranchCode;
                                Surprise_cash_annexure_2.FINANCIAL_YEAR = FinancialYear;
                                Surprise_cash_annexure_2.QUATER = annexureOneDetails.Quater;
                                Surprise_cash_annexure_2.REGION_NAME = regionName;
                                Surprise_cash_annexure_2.REGION_CODE = regionCode;
                                Surprise_cash_annexure_2.UNIQUE_ID = Guid.NewGuid().ToString("N");
                                Surprise_cash_annexure_2.IS_DELETED = "N";
                                Surprise_cash_annexure_2.IS_DISABLE = "N";
                                dbContext.SurpriseCashAnnexureTwo.AddRange(Surprise_cash_annexure_2);
                                dbContext.SaveChanges();
                                nominatedSVBranches.Add(SVBranchCode2);
                                insertedrefNos.Add(res.REF_NO);
                                logger?.LogInformation("Successfully runned upto SURPRISE_CASH_ANNEXURE_2 table");
                                var quarter = annexureOneDetails.Quater.Substring(1, 1);
                                string message = $"Dear Sir/Madam,\n\n" +
                                        $"You are nominated to conduct Surprise Cash Verification of {SVBranchCode2} Branch for Quarter {quarter}, {FinancialYear}. Please complete the process on time.\n\n" +
                                        $"DyRH - Business Operations\n" +
                                        $"{regionName} - Union Bank of India";
                                var inspectingOfficerMobileNumber = $@"
                                        select PHONE from StaffDetails 
                                        where LOCATION = '{IoBranchCode}' and EMPLID = '{BranchEmpId}'";
                                var mobileNumber = organisationsDb.Set<StaffDetails2>().FromSqlRaw(inspectingOfficerMobileNumber).FirstOrDefault();
                                logger?.LogInformation("inspectingOfficerMobileNumber " + mobileNumber?.PHONE);
                                //string url = configuration["GetURL:OTPAPIURL"].ToString() + "?mobile=91" + mobileNumber?.PHONE + "&message=" + message;
                                string url = configuration["GetURL:OTPAPIURL"].ToString() + "?mobile=917075470987" + "&message=" + message;

                                logger?.LogInformation("APIURL " + url);
                                apiUrls.Add(url);
                            }
                        }
                    }
                }
                string svBranchNme = string.Join(", ", nominatedSVBranches);
                msg = nominatedSVBranches.Count == 1 ? $"Nomination done for: {svBranchNme} branch" : $"Nomination done for: {svBranchNme} branches";
                foreach (var url in apiUrls)
                {
                    callurl(url);
                }
                transaction.Commit(); // Commit once after all inserts
                logger?.LogInformation("AddAnnexureOneDetails Service Ended, Sucessfully committed data to both the annexure tables");
                return (true, insertedrefNos, msg);
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                logger?.LogInformation($"Error occurred in AddAnnexureOneDetails Service. Transaction roll backed: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }
        public (bool IsSuccess, string? ErrorMsg) AddAnnexureTwoDetails(SurpriseCashAnnexure2DTO annexureTwoDetails)
        {
            try
            {
                logger?.LogInformation("AddAnnexureTwoDetails Service Started");
                var exist = dbContext.SurpriseCashAnnexureTwo.FirstOrDefault(e => e.NAME_OF_INSPECTING_OFFICER == annexureTwoDetails.NameOfInspectingOfficer && e.SV_BRANCH_CODE == annexureTwoDetails.SVBranchCode && e.FINANCIAL_YEAR == annexureTwoDetails.FinancialYear && e.QUATER == annexureTwoDetails.Quater && e.IS_DELETED == "N");

                if (exist != null)
                {
                    logger?.LogInformation("AddAnnexureTwoDetails Service, Inside exist condition");
                    if (annexureTwoDetails.AnnexureStatus == "Saved")
                    {
                        logger?.LogInformation("AddAnnexureTwoDetails Service, Inside Saved Status condition");
                        //exist.NAME_OF_INSPECTING_OFFICER = annexureTwoDetails.NameOfInspectingOfficer;
                        exist.NAME_OF_BRANCH = annexureTwoDetails.NameOfBranch;
                        exist.DATE_OF_PREV_SURPRISE_VERIFICATION = annexureTwoDetails.DateOfPrevSurpriseVerification;
                        exist.OPENING_CLOSING_OF_BUSINESS = annexureTwoDetails.OpeningClosingOfBusiness;
                        exist.OPENING_CLOSING_OF_BUSINESS_AMOUNT = annexureTwoDetails.OpeningClosingOfBusinessAmount;
                        exist.SAFE_CUSTODY_RECEIPT_DATED = annexureTwoDetails.SafeCustodyReceiptDated;
                        exist.SAFE_CUSTODY_RECEIPT = annexureTwoDetails.SafeCustodyReceipt;
                        exist.STAMPED_AGREEMENT_FORMS = annexureTwoDetails.StampedAgreementForms;
                        exist.STAMPED_AGREEMENT_FORMS_AMOUNT = annexureTwoDetails.StampedAgreementFormsAmount;
                        exist.NO_OF_POST_PARCELS_HELD_BY_BRANCH = annexureTwoDetails.NoOfPostParcelsHeldByBranch;
                        exist.POST_PARCELS_HELD_BY_BRANCH = annexureTwoDetails.PostParcelsHeldByBranch;
                        exist.POSTAL_STAMPS = annexureTwoDetails.PostalStamps;
                        exist.POSTAL_STAMPS_AMOUNT = annexureTwoDetails.PostalStampsAmount;
                        exist.MONTHLY_CASH_VERIFICATION_OF_CASH = annexureTwoDetails.MonthlyCashVerification;
                        exist.PERIODICAL_SURPRISE_CHECK = annexureTwoDetails.PeriodicalSurpriseCheck;
                        exist.KEPT_UNDER_JOINT_CUSTODY = annexureTwoDetails.KeptUnderJointCustody;
                        exist.JOINT_CUSTODIAN_VERIFYING = annexureTwoDetails.JointCustodianVerifying;
                        exist.OTHER_GUIDELINES_COMPILED = annexureTwoDetails.OtherGuidelinesCompiled;
                        exist.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY = annexureTwoDetails.KeyRegisterKeptUnderJointCustody;
                        exist.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED = annexureTwoDetails.KeyRegisterWhetherKeyRegisterMaintained;
                        exist.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS = annexureTwoDetails.KeyRegisterDuplicateSetOfCashKeys;
                        exist.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_DATE = annexureTwoDetails.KeyRegisterDuplicateSetOfCashKeysDate;
                        exist.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS = annexureTwoDetails.KeyRegisterMasterKeyOfTheLockers;
                        exist.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH = annexureTwoDetails.SafetySecurityFoundThatStoringRoomDoorOfBranch;
                        exist.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM = annexureTwoDetails.SafetySecurityFoundThatDoorOfNetworkRoom;
                        exist.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM = annexureTwoDetails.SafetySecurityFoundThatBurglaryAlarmSystem;
                        exist.WHETHER_ULTRAVIOLET_LAMP_PROVIDED = annexureTwoDetails.WhetherUltravioletLampProvided;
                        exist.WHETHER_ULTRAVIOLET_LAMP_WORKING = annexureTwoDetails.WhetherUltravioletLampWorking;
                        exist.CCTV_SYSTEM_IS_PROVIDED = annexureTwoDetails.CCTVSystemIsProvided;
                        exist.CCTV_SYSTEM_IS_WORKING = annexureTwoDetails.CCTVSystemIsWorking;
                        exist.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE = annexureTwoDetails.CCTVRecordingOfLast90DaysAvailable;
                        exist.CASH_COUNTING_MACHINE_PROVIDED = annexureTwoDetails.CashCountingMachineProvided;
                        exist.CASH_COUNTING_MACHINE_WORKING = annexureTwoDetails.CashCountingMachineWorking;
                        exist.NOTE_SORTING_MACHINE_PROVIDED = annexureTwoDetails.NoteSortingMachineProvided;
                        exist.NOTE_SORTING_MACHINE_WORKING = annexureTwoDetails.NoteSortingMachineWorking;
                        exist.SECURITY_GUARD_IS_INVOLVED = annexureTwoDetails.SecurityGuardIsInvolved;
                        exist.SECURITY_GUARD_IS_INVOLVED_DETAILS = annexureTwoDetails.SecurityGuardIsInvolvedDetails;
                        exist.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH = annexureTwoDetails.WhetherBranchHasConductedSurpriseCash;
                        exist.PHYSICAL_CASH_IN_ATM_VERIFIED = annexureTwoDetails.PhysicalCashInAtmVerified;
                        exist.DISCREPANCIES = annexureTwoDetails.Discrepancies;
                        exist.NOTES_2000 = annexureTwoDetails.Notes2000;
                        exist.NOTES_500 = annexureTwoDetails.Notes500;
                        exist.NOTES_200 = annexureTwoDetails.Notes200;
                        exist.NOTES_100 = annexureTwoDetails.Notes100;
                        exist.NOTES_50 = annexureTwoDetails.Notes50;
                        exist.NOTES_20 = annexureTwoDetails.Notes20;
                        exist.NOTES_10 = annexureTwoDetails.Notes10;
                        exist.NOTES_5 = annexureTwoDetails.Notes5;
                        exist.NOTES_2 = annexureTwoDetails.Notes2;
                        exist.NOTES_1 = annexureTwoDetails.Notes1;
                        exist.COINS_10 = annexureTwoDetails.Coins10;
                        exist.COINS_5 = annexureTwoDetails.Coins5;
                        exist.COINS_2 = annexureTwoDetails.Coins2;
                        exist.COINS_1 = annexureTwoDetails.Coins1;
                        exist.COINS_50_PAISA = annexureTwoDetails.Coins50Paisa;
                        exist.SAFE_CUSTODY_RECEIPTNAME = annexureTwoDetails.SafeCustodyReceiptName;
                        exist.SOILED_NOTES_AMT = annexureTwoDetails.SoiledNotesAmt;
                        exist.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO = annexureTwoDetails.KeyRegisterKeptUnderJointCustodyNo;
                        exist.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO = annexureTwoDetails.KeyRegisterWhetherKeyRegisterMaintainedNo;
                        exist.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO = annexureTwoDetails.KeyRegisterDuplicateSetOfCashKeysNo;
                        exist.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO = annexureTwoDetails.KeyRegisterMasterKeyOfTheLockersNo;
                        exist.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO = annexureTwoDetails.SafetySecurityFoundThatBurglaryAlarmSystemNo;
                        exist.WHETHER_ULTRAVIOLET_LAMP_PROVIDED_NO = annexureTwoDetails.WhetherUltravioletLampProvidedNo;
                        exist.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO = annexureTwoDetails.WhetherUltravioletLampWorkingNo;
                        exist.CCTV_SYSTEM_IS_PROVIDED_NO = annexureTwoDetails.CCTVSystemIsProvidedNo;
                        exist.CCTV_SYSTEM_IS_WORKING_NO = annexureTwoDetails.CCTVSystemIsWorkingNo;
                        exist.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE_NO = annexureTwoDetails.CCTVRecordingOfLast90DaysAvailableNo;
                        exist.CASH_COUNTING_MACHINE_PROVIDED_NO = annexureTwoDetails.CashCountingMachineProvidedNo;
                        exist.CASH_COUNTING_MACHINE_WORKING_NO = annexureTwoDetails.CashCountingMachineWorkingNo;
                        exist.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_DATE = annexureTwoDetails.WhetherBranchHasConductedSurpriseCashDate;
                        exist.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO = annexureTwoDetails.WhetherBranchHasConductedSurpriseCashNo;
                        exist.PHYSICAL_CASH_IN_ATM_VERIFIED_DATE = annexureTwoDetails.PhysicalCashInAtmVerifiedDate;
                        exist.PHYSICAL_CASH_IN_ATM_VERIFIED_NO = annexureTwoDetails.PhysicalCashInAtmVerifiedNo;
                        exist.WHETHERMACHINESORTEDNOTES = annexureTwoDetails.WhetherMachineSortedNotes;
                        exist.WHETHERMACHINESORTEDNOTESNO = annexureTwoDetails.WhetherMachineSortedNotesNo;
                        exist.WHETHERAVAITABITITYOFNAM = annexureTwoDetails.WhetherAvaitabitityofNAM;
                        exist.WHETHERAVAITABITITYOFNAMNO = annexureTwoDetails.WhetherAvaitabitityofNAMNo;
                        exist.WHETHERFIR = annexureTwoDetails.WhetherFIR;
                        exist.WHETHERFIRNO = annexureTwoDetails.WhetherFIRNo;
                        exist.MONTHTYCONSOTIDATEDREPORT = annexureTwoDetails.MonthlyConsotidatedReport;
                        exist.MONTHTYCONSOTIDATEDREPORTNO = annexureTwoDetails.MonthlyConsotidatedReportNo;
                        exist.COINS_20 = annexureTwoDetails.Coins20;
                        exist.ANNEXURE_STATUS = annexureTwoDetails.AnnexureStatus;
                        exist.REGION_CODE = annexureTwoDetails.RegionCode;
                        exist.ZONE_CODE = annexureTwoDetails.ZoneCode;
                        exist.ZONE_NAME = annexureTwoDetails.ZoneName;
                        exist.CREATED_BY = annexureTwoDetails.CreatedBy;
                        exist.MODIFIED_BY = annexureTwoDetails.CreatedBy;
                        exist.MODIFIED_ON = DateTime.Now;
                        exist.IS_DISABLE = "N";
                        exist.CASH_SELECTION_TYPE = annexureTwoDetails.cashSelectionType;
                        dbContext.SurpriseCashAnnexureTwo.Update(exist);
                        dbContext.SaveChanges();
                        logger?.LogInformation("AddAnnexureTwoDetails Service, data Saved into SurpriseCashAnnexure2 table Successfully");
                    }
                    else
                    {
                        logger?.LogInformation("AddAnnexureTwoDetails Service, Inside Submitted Status condition");
                        exist.NAME_OF_BRANCH = annexureTwoDetails.NameOfBranch;
                        exist.DATE_OF_PREV_SURPRISE_VERIFICATION = annexureTwoDetails.DateOfPrevSurpriseVerification;
                        exist.OPENING_CLOSING_OF_BUSINESS = annexureTwoDetails.OpeningClosingOfBusiness;
                        exist.OPENING_CLOSING_OF_BUSINESS_AMOUNT = annexureTwoDetails.OpeningClosingOfBusinessAmount;
                        exist.SAFE_CUSTODY_RECEIPT_DATED = annexureTwoDetails.SafeCustodyReceiptDated;
                        exist.SAFE_CUSTODY_RECEIPT = annexureTwoDetails.SafeCustodyReceipt;
                        exist.STAMPED_AGREEMENT_FORMS = annexureTwoDetails.StampedAgreementForms;
                        exist.STAMPED_AGREEMENT_FORMS_AMOUNT = annexureTwoDetails.StampedAgreementFormsAmount;
                        exist.NO_OF_POST_PARCELS_HELD_BY_BRANCH = annexureTwoDetails.NoOfPostParcelsHeldByBranch;
                        exist.POST_PARCELS_HELD_BY_BRANCH = annexureTwoDetails.PostParcelsHeldByBranch;
                        exist.POSTAL_STAMPS = annexureTwoDetails.PostalStamps;
                        exist.POSTAL_STAMPS_AMOUNT = annexureTwoDetails.PostalStampsAmount;
                        exist.MONTHLY_CASH_VERIFICATION_OF_CASH = annexureTwoDetails.MonthlyCashVerification;
                        exist.PERIODICAL_SURPRISE_CHECK = annexureTwoDetails.PeriodicalSurpriseCheck;
                        exist.KEPT_UNDER_JOINT_CUSTODY = annexureTwoDetails.KeptUnderJointCustody;
                        exist.JOINT_CUSTODIAN_VERIFYING = annexureTwoDetails.JointCustodianVerifying;
                        exist.OTHER_GUIDELINES_COMPILED = annexureTwoDetails.OtherGuidelinesCompiled;
                        exist.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY = annexureTwoDetails.KeyRegisterKeptUnderJointCustody;
                        exist.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED = annexureTwoDetails.KeyRegisterWhetherKeyRegisterMaintained;
                        exist.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS = annexureTwoDetails.KeyRegisterDuplicateSetOfCashKeys;
                        exist.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_DATE = annexureTwoDetails.KeyRegisterDuplicateSetOfCashKeysDate;
                        exist.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS = annexureTwoDetails.KeyRegisterMasterKeyOfTheLockers;
                        exist.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH = annexureTwoDetails.SafetySecurityFoundThatStoringRoomDoorOfBranch;
                        exist.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM = annexureTwoDetails.SafetySecurityFoundThatDoorOfNetworkRoom;
                        exist.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM = annexureTwoDetails.SafetySecurityFoundThatBurglaryAlarmSystem;
                        exist.WHETHER_ULTRAVIOLET_LAMP_PROVIDED = annexureTwoDetails.WhetherUltravioletLampProvided;
                        exist.WHETHER_ULTRAVIOLET_LAMP_WORKING = annexureTwoDetails.WhetherUltravioletLampWorking;
                        exist.CCTV_SYSTEM_IS_PROVIDED = annexureTwoDetails.CCTVSystemIsProvided;
                        exist.CCTV_SYSTEM_IS_WORKING = annexureTwoDetails.CCTVSystemIsWorking;
                        exist.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE = annexureTwoDetails.CCTVRecordingOfLast90DaysAvailable;
                        exist.CASH_COUNTING_MACHINE_PROVIDED = annexureTwoDetails.CashCountingMachineProvided;
                        exist.CASH_COUNTING_MACHINE_WORKING = annexureTwoDetails.CashCountingMachineWorking;
                        exist.NOTE_SORTING_MACHINE_PROVIDED = annexureTwoDetails.NoteSortingMachineProvided;
                        exist.NOTE_SORTING_MACHINE_WORKING = annexureTwoDetails.NoteSortingMachineWorking;
                        exist.SECURITY_GUARD_IS_INVOLVED = annexureTwoDetails.SecurityGuardIsInvolved;
                        exist.SECURITY_GUARD_IS_INVOLVED_DETAILS = annexureTwoDetails.SecurityGuardIsInvolvedDetails;
                        exist.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH = annexureTwoDetails.WhetherBranchHasConductedSurpriseCash;
                        exist.PHYSICAL_CASH_IN_ATM_VERIFIED = annexureTwoDetails.PhysicalCashInAtmVerified;
                        exist.DISCREPANCIES = annexureTwoDetails.Discrepancies;
                        exist.NOTES_2000 = annexureTwoDetails.Notes2000;
                        exist.NOTES_500 = annexureTwoDetails.Notes500;
                        exist.NOTES_200 = annexureTwoDetails.Notes200;
                        exist.NOTES_100 = annexureTwoDetails.Notes100;
                        exist.NOTES_50 = annexureTwoDetails.Notes50;
                        exist.NOTES_20 = annexureTwoDetails.Notes20;
                        exist.NOTES_10 = annexureTwoDetails.Notes10;
                        exist.NOTES_5 = annexureTwoDetails.Notes5;
                        exist.NOTES_2 = annexureTwoDetails.Notes2;
                        exist.NOTES_1 = annexureTwoDetails.Notes1;
                        exist.COINS_10 = annexureTwoDetails.Coins10;
                        exist.COINS_5 = annexureTwoDetails.Coins5;
                        exist.COINS_2 = annexureTwoDetails.Coins2;
                        exist.COINS_1 = annexureTwoDetails.Coins1;
                        exist.COINS_50_PAISA = annexureTwoDetails.Coins50Paisa;
                        exist.SAFE_CUSTODY_RECEIPTNAME = annexureTwoDetails.SafeCustodyReceiptName;
                        exist.SOILED_NOTES_AMT = annexureTwoDetails.SoiledNotesAmt;
                        exist.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO = annexureTwoDetails.KeyRegisterKeptUnderJointCustodyNo;
                        exist.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO = annexureTwoDetails.KeyRegisterWhetherKeyRegisterMaintainedNo;
                        exist.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO = annexureTwoDetails.KeyRegisterDuplicateSetOfCashKeysNo;
                        exist.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO = annexureTwoDetails.KeyRegisterMasterKeyOfTheLockersNo;
                        exist.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO = annexureTwoDetails.SafetySecurityFoundThatBurglaryAlarmSystemNo;
                        exist.WHETHER_ULTRAVIOLET_LAMP_PROVIDED_NO = annexureTwoDetails.WhetherUltravioletLampProvidedNo;
                        exist.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO = annexureTwoDetails.WhetherUltravioletLampWorkingNo;
                        exist.CCTV_SYSTEM_IS_PROVIDED_NO = annexureTwoDetails.CCTVSystemIsProvidedNo;
                        exist.CCTV_SYSTEM_IS_WORKING_NO = annexureTwoDetails.CCTVSystemIsWorkingNo;
                        exist.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE_NO = annexureTwoDetails.CCTVRecordingOfLast90DaysAvailableNo;
                        exist.CASH_COUNTING_MACHINE_PROVIDED_NO = annexureTwoDetails.CashCountingMachineProvidedNo;
                        exist.CASH_COUNTING_MACHINE_WORKING_NO = annexureTwoDetails.CashCountingMachineWorkingNo;
                        exist.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_DATE = annexureTwoDetails.WhetherBranchHasConductedSurpriseCashDate;
                        exist.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO = annexureTwoDetails.WhetherBranchHasConductedSurpriseCashNo;
                        exist.PHYSICAL_CASH_IN_ATM_VERIFIED_DATE = annexureTwoDetails.PhysicalCashInAtmVerifiedDate;
                        exist.PHYSICAL_CASH_IN_ATM_VERIFIED_NO = annexureTwoDetails.PhysicalCashInAtmVerifiedNo;

                        exist.WHETHERMACHINESORTEDNOTES = annexureTwoDetails.WhetherMachineSortedNotes;
                        exist.WHETHERMACHINESORTEDNOTESNO = annexureTwoDetails.WhetherMachineSortedNotesNo;
                        exist.WHETHERAVAITABITITYOFNAM = annexureTwoDetails.WhetherAvaitabitityofNAM;
                        exist.WHETHERAVAITABITITYOFNAMNO = annexureTwoDetails.WhetherAvaitabitityofNAMNo;
                        exist.WHETHERFIR = annexureTwoDetails.WhetherFIR;
                        exist.WHETHERFIRNO = annexureTwoDetails.WhetherFIRNo;
                        exist.MONTHTYCONSOTIDATEDREPORT = annexureTwoDetails.MonthlyConsotidatedReport;
                        exist.MONTHTYCONSOTIDATEDREPORTNO = annexureTwoDetails.MonthlyConsotidatedReportNo;

                        exist.COINS_20 = annexureTwoDetails.Coins20;
                        exist.ANNEXURE_STATUS = annexureTwoDetails.AnnexureStatus;
                        exist.REGION_CODE = annexureTwoDetails.RegionCode;
                        exist.ZONE_CODE = annexureTwoDetails.ZoneCode;
                        exist.ZONE_NAME = annexureTwoDetails.ZoneName;
                        exist.CREATED_BY = annexureTwoDetails.CreatedBy;
                        exist.MODIFIED_BY = annexureTwoDetails.CreatedBy;
                        exist.MODIFIED_ON = DateTime.Now;
                        exist.IS_DISABLE = "Y";
                        exist.CASH_SELECTION_TYPE = annexureTwoDetails.cashSelectionType;
                        dbContext.SurpriseCashAnnexureTwo.Update(exist);
                        dbContext.SaveChanges();
                        logger?.LogInformation("AddAnnexureTwoDetails Service, data Submitted into SurpriseCashAnnexure2 table Successfully");
                    }
                }
                logger?.LogInformation("AddAnnexureTwoDetails Service Ended, Annexure-II Updated Successfully");
                return (true, "Annexure-II Updated Successfully");
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in AddAnnexureTwoDetails Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, realerror.Message);
            }
        }

        public (bool IsSuccess, string? ErrorMsg) AddComment(CommentDTO commentDTO)
        {
            try
            {
                var exist = dbContext.SurpriseCashAnnexureTwo.FirstOrDefault(e => e.SV_BRANCH_CODE == commentDTO.SVBranchCode && e.REF_NO == commentDTO.RefNo);

                if (exist != null)
                {
                    //mapper.Map(commentDTO.SVBranchCode, exist);
                    exist.MODIFIED_BY = EncryptoData.DecryptAes(commentDTO.ModifiedBy);
                    exist.MODIFIED_ON = DateTime.Now;
                    exist.ANNEXURE_COMMENT = commentDTO.Comment;
                    exist.ANNEXURE_STATUS = commentDTO.Status;
                    dbContext.SurpriseCashAnnexureTwo.Update(exist);
                    dbContext.SaveChanges();
                    return (true, "Comment Added Successfully");
                }
                else
                {
                    return (false, "Record not found");
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

        public (bool IsSuccess, string? ErrorMsg) AddBranchComplied(BranchCompliedDTO branchCompliedDTO)
        {
            try
            {
                logger?.LogInformation($"AddBranchComplied Service(BH Complied,NotComplied) Started and request Object is: {JsonConvert.SerializeObject(branchCompliedDTO)}");
                var exist = dbContext.SurpriseCashAnnexureTwo.FirstOrDefault(e => e.REF_NO == branchCompliedDTO.RefNo);

                if (exist != null)
                {
                    logger?.LogInformation($"AddBranchComplied Service, Inside exist condition");
                    exist.ACTION_TAKEN_BY_BRANCH = branchCompliedDTO.ActionTakenByBranch;
                    exist.ACTION_TAKEN_BRANCH_DATE = DateTime.Now;
                    exist.ACTION_TAKEN_BRANCH_ID = branchCompliedDTO.ActionTakenBranchId;
                    exist.ANNEXURE_STATUS_BRANCH = branchCompliedDTO.AnnexureStatusBranch;
                    dbContext.SurpriseCashAnnexureTwo.Update(exist);
                    dbContext.SaveChanges();
                    logger?.LogInformation($"AddBranchComplied Service Ended, Complied Added Successfully");
                    return (true, "Complied Added Successfully");
                }
                else
                {
                    logger?.LogInformation($"AddBranchComplied Service, Record not found");
                    return (false, "Record not found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in AddBranchComplied Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, realerror.Message);
            }
        }

        public (bool IsSuccess, string? ErrorMsg) AddROComplied(ROCompliedDTO roCompliedDTO)
        {
            try
            {
                logger?.LogInformation($"AddROComplied Service Started, request object is:{JsonConvert.SerializeObject(roCompliedDTO)}");
                var exist = dbContext.SurpriseCashAnnexureTwo.FirstOrDefault(e => e.REF_NO == roCompliedDTO.RefNo);

                if (exist != null)
                {
                    logger?.LogInformation($"AddROComplied Service Inside exist condition");
                    if (roCompliedDTO.AnnexureStatusRO == "Complied By RO")
                    {
                        logger?.LogInformation($"AddROComplied Service Inside Complied By RO condition");
                        exist.ACTION_TAKEN_BY_RO = roCompliedDTO.ActionTakenByRO;
                        exist.ACTION_TAKEN_RO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_RO_ID = roCompliedDTO.ActionTakenROId;
                        exist.ANNEXURE_STATUS_RO = roCompliedDTO.AnnexureStatusRO;
                        exist.ACTION_TAKEN_BY_ZO = roCompliedDTO.ActionTakenByRO;
                        exist.ACTION_TAKEN_ZO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_ZO_ID = roCompliedDTO.ActionTakenROId;
                        exist.ANNEXURE_STATUS_ZO = "Complied by ZO";
                        exist.ACTION_TAKEN_BY_CO = roCompliedDTO.ActionTakenByRO;
                        exist.ACTION_TAKEN_CO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_CO_ID = roCompliedDTO.ActionTakenROId;
                        exist.ANNEXURE_STATUS_CO = "Complied by CO";
                        //exist.DATE_OF_PREV_SURPRISE_VERIFICATION = DateTime.Now.ToString("yyyy-MM-dd");
                    }
                    else
                    {
                        logger?.LogInformation($"AddROComplied Service Inside else(Not Complied By RO) condition");
                        exist.ACTION_TAKEN_BY_RO = roCompliedDTO.ActionTakenByRO;
                        exist.ACTION_TAKEN_RO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_RO_ID = roCompliedDTO.ActionTakenROId;
                        exist.ANNEXURE_STATUS_RO = roCompliedDTO.AnnexureStatusRO;
                    }
                    dbContext.SurpriseCashAnnexureTwo.Update(exist);
                    dbContext.SaveChanges();
                    logger?.LogInformation($"AddROComplied Service Ended, Complied Added Successfully");
                    return (true, "Complied Added Successfully");
                }
                else
                {
                    logger?.LogInformation($"AddROComplied Service, Record not found");
                    return (false, "Record not found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in AddROComplied Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, realerror.Message);
            }
        }

        public (bool IsSuccess, string? ErrorMsg) AddZOComplied(ZOCompliedDTO zoCompliedDTO)
        {
            try
            {
                logger?.LogInformation($"AddZOComplied Service Started, request object is:{JsonConvert.SerializeObject(zoCompliedDTO)}");
                var exist = dbContext.SurpriseCashAnnexureTwo.FirstOrDefault(e => e.REF_NO == zoCompliedDTO.RefNo);

                if (exist != null)
                {
                    logger?.LogInformation($"AddZOComplied Service, Inside exist condition");
                    if (zoCompliedDTO.AnnexureStatusZO == "Complied By ZO")
                    {
                        logger?.LogInformation($"AddZOComplied Service, Inside Complied By ZO condition");
                        exist.ACTION_TAKEN_BY_ZO = zoCompliedDTO.ActionTakenByZO;
                        exist.ACTION_TAKEN_ZO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_ZO_ID = zoCompliedDTO.ActionTakenZOId;
                        exist.ANNEXURE_STATUS_ZO = zoCompliedDTO.AnnexureStatusZO;
                        exist.ACTION_TAKEN_BY_CO = zoCompliedDTO.ActionTakenByZO;
                        exist.ACTION_TAKEN_CO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_CO_ID = zoCompliedDTO.ActionTakenZOId;
                        exist.ANNEXURE_STATUS_CO = zoCompliedDTO.AnnexureStatusZO;
                        //exist.DATE_OF_PREV_SURPRISE_VERIFICATION = DateTime.Now.ToString("yyyy-MM-dd");
                    }
                    else
                    {
                        logger?.LogInformation($"AddZOComplied Service, Inside else(Not Complied By ZO) condition");
                        exist.ACTION_TAKEN_BY_ZO = zoCompliedDTO.ActionTakenByZO;
                        exist.ACTION_TAKEN_ZO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_ZO_ID = zoCompliedDTO.ActionTakenZOId;
                        exist.ANNEXURE_STATUS_ZO = zoCompliedDTO.AnnexureStatusZO;
                    }
                    dbContext.SurpriseCashAnnexureTwo.Update(exist);
                    dbContext.SaveChanges();
                    logger?.LogInformation($"AddZOComplied Service Ended, Complied Added Successfully");
                    return (true, "Complied Added Successfully");
                }
                else
                {
                    logger?.LogInformation($"AddZOComplied Service, Record not found");
                    return (false, "Record not found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in AddZOComplied Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, realerror.Message);
            }
        }

        public (bool IsSuccess, string? ErrorMsg) AddCOComplied(COCompliedDTO coCompliedDTO)
        {
            try
            {
                logger?.LogInformation($"AddCOComplied Service Started, request object is:{JsonConvert.SerializeObject(coCompliedDTO)}");
                var exist = dbContext.SurpriseCashAnnexureTwo.FirstOrDefault(e => e.REF_NO == coCompliedDTO.RefNo);

                if (exist != null)
                {
                    logger?.LogInformation($"AddCOComplied Service, Inside exist condition");
                    if (coCompliedDTO.AnnexureStatusCO == "Complied By CO")
                    {
                        logger?.LogInformation($"AddCOComplied Service, Inside Complied By CO condition");
                        exist.ACTION_TAKEN_BY_CO = coCompliedDTO.ActionTakenByCO;
                        exist.ACTION_TAKEN_CO_DATE = DateTime.Now;
                        exist.ACTION_TAKEN_CO_ID = coCompliedDTO.ActionTakenCOId;
                        exist.ANNEXURE_STATUS_CO = coCompliedDTO.AnnexureStatusCO;
                        //exist.DATE_OF_PREV_SURPRISE_VERIFICATION = DateTime.Now.ToString("yyyy-MM-dd");
                    }
                    dbContext.SurpriseCashAnnexureTwo.Update(exist);
                    dbContext.SaveChanges();
                    logger?.LogInformation($"AddCOComplied Service Ended, Complied Added Successfully");
                    return (true, "Complied Added Successfully");
                }
                else
                {
                    logger?.LogInformation($"AddCOComplied Service, Record not found");
                    return (false, "Record not found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in AddCOComplied Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, realerror.Message);
            }
        }

        public (bool IsSuccess, string? ErrorMsg) AddApproved(ApprovedDTO approvedDTO)
        {
            try
            {
                logger?.LogInformation($"AddApproved Service Started request Object is: {JsonConvert.SerializeObject(approvedDTO)}");
                var exist = dbContext.SurpriseCashAnnexureTwo.FirstOrDefault(e => e.REF_NO == approvedDTO.RefNo);

                if (exist != null)
                {
                    logger?.LogInformation($"Inside AddApproved Service exist condition");
                    //mapper.Map(commentDTO.SVBranchCode, exist);
                    exist.MODIFIED_BY = approvedDTO.ModifiedBy;
                    exist.MODIFIED_ON = DateTime.Now;
                    exist.ANNEXURE_STATUS = approvedDTO.Status;
                    dbContext.SurpriseCashAnnexureTwo.Update(exist);
                    dbContext.SaveChanges();
                    logger?.LogInformation($"AddApproved Service Ended, Status- Approved Successfully");
                    return (true, "Approved Successfully");
                }
                else
                {
                    logger?.LogInformation($"AddApproved Service Record not found");
                    return (false, "Record not found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in AddApproved Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, realerror.Message);
            }
        }

        public (bool IsSuccess, string? ErrorMsg) AddAnnexureThreeDetails(SurpriseCashAnnexure3DTO annexureThreeDetails)
        {
            try
            {
                var res = mapper.Map<SurpriseCashAnnexure3DTO, SURPRISE_CASH_ANNEXURE_3>(annexureThreeDetails);
                res.CREATED_ON = DateTime.Now;
                res.MODIFIED_BY = "";
                res.MODIFIED_ON = DateTime.Now;
                res.UNIQUE_ID = Guid.NewGuid().ToString("N");
                dbContext.SurpriseCashAnnexureThree.AddRange(res);
                dbContext.SaveChanges();
                return (true, "Annexure-III Added Successfully");
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

        public (bool IsSuccess, string? ErrorMsg) AddAnnexureFourDetails(SurpriseCashAnnexure4DTO annexureFourDetails)
        {
            try
            {
                var res = mapper.Map<SurpriseCashAnnexure4DTO, SURPRISE_CASH_ANNEXURE_4>(annexureFourDetails);
                res.CREATED_ON = DateTime.Now;
                res.MODIFIED_BY = "";
                res.MODIFIED_ON = DateTime.Now;
                res.UNIQUE_ID = Guid.NewGuid().ToString("N");
                dbContext.SurpriseCashAnnexureFour.AddRange(res);
                dbContext.SaveChanges();
                return (true, "Annexure-IV Added Successfully");
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

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureThreeDetails(string status, string code, string iszone)
        {
            try
            {
                var staffdetails = await dbContext.SurpriseCashAnnexureThree.Where(x => x.ANNEXURE_STATUS == status && (iszone == "Yes" ? x.ZONE_CODE == code : x.REGION_CODE == code)).ToListAsync();
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

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByRegionCode(string regionCode)
        {
            try
            {
                logger.LogInformation($"GetAnnexureTwoDetailsByRegionCode Service Started REGION_CODE: {regionCode}");
                var staffdetails = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.REGION_CODE == regionCode).ToListAsync();
                logger.LogInformation($"GetAnnexureTwoDetailsByRegionCode Service query executed & response count: {staffdetails.Count}");

                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger.LogInformation($"GetAnnexureTwoDetailsByRegionCode Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger.LogInformation("GetAnnexureTwoDetailsByRegionCode Service, No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"Error in GetAnnexureTwoDetailsByRegionCode Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByRegionCodeQuater(string FinancialYear, string Quater, string ZoneCode, string RegionCode)
        {
            try
            {
                logger.LogInformation($"GetAnnexureTwoDetailsByRegionCodeQuater Service(Discrepancies Report-DYRH,ZO,CO) Started financialYear: {FinancialYear}, quater: {Quater},a2.REGION_CODE:{RegionCode},a2.ZoneCode:{ZoneCode}");
                if (RegionCode == "All")
                {
                    var staffdetails1 = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.FINANCIAL_YEAR == FinancialYear && x.QUATER == Quater && x.ZONE_CODE == ZoneCode).ToListAsync();
                    if (staffdetails1 != null)
                    {
                        string staffDetailsJson = JsonConvert.SerializeObject(staffdetails1);
                        string res = EncryptoData.EncryptString(staffDetailsJson);
                        return (true, res, null);
                    }
                    else
                    {
                        return (false, null, "No record Found");
                    }
                }
                else
                {
                    var staffdetails = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.FINANCIAL_YEAR == FinancialYear && x.QUATER == Quater && x.ZONE_CODE == ZoneCode && x.REGION_CODE == RegionCode).ToListAsync();
                    logger.LogInformation($"GetAnnexureTwoDetailsByRegionCodeQuater(Discrepancies Report-DYRH,ZO) Service Completed Successfully with response Count: {staffdetails.Count}");
                    if (staffdetails != null)
                    {
                        string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                        string res = EncryptoData.EncryptString(staffDetailsJson);
                        logger.LogInformation($"GetAnnexureTwoDetailsByRegionCodeQuater Service Ended");
                        return (true, res, null);
                    }
                    else
                    {
                        logger.LogInformation("GetAnnexureTwoDetailsByRegionCodeQuater Service No record Found");
                        return (false, null, "No record Found");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"Error occured in GetAnnexureTwoDetailsByRegionCodeQuater Service: {ex.Message}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByPFNo(string ReqParameter, string financialYear, string quarter, string regionCode, string regionName)
        {
            try
            {
                logger.LogInformation($"GetAnnexureTwoDetailsByPFNo(Branch SCV report-DYRH) Service Started financialYear: {financialYear}, quater: {quarter},a2.REGION_CODE:{regionCode}");
                var staffdetails = await (from a1 in dbContext.SurpriseCashAnnexureOne
                                          join a2 in dbContext.SurpriseCashAnnexureTwo
                                          //on a1.SV_BRANCH_CODE + a1.FINANCIAL_YEAR + a1.QUATER + a1.BRANCH_PFNO equals a2.SV_BRANCH_CODE + a2.FINANCIAL_YEAR + a2.QUATER + a2.CREATED_BY
                                          on new { a1.REF_NO }
                                          equals new { a2.REF_NO }
                                          into annexureTwoGroup
                                          from a2 in annexureTwoGroup.DefaultIfEmpty() // This ensures the LEFT JOIN
                                                                                       //where a1.CREATED_BY == ReqParameter
                                          where (a2.REGION_CODE == regionCode || a1.FROM_REGION_NAME == regionName || a2.REGION_NAME == regionName)
                                          && (a1.IS_DELETED == "N" || a2.ANNEXURE_STATUS == "Deleted") && a2.FINANCIAL_YEAR == financialYear && a2.QUATER == quarter
                                          select new
                                          {
                                              AnnexureOneData = a1,
                                              AnnexureTwoData = a2, // This could be null if there's no match
                                          }).OrderByDescending(x => x.AnnexureOneData.REF_NO).ToListAsync();
                if (staffdetails != null)
                {
                    logger.LogInformation($"GetAnnexureTwoDetailsByPFNo Service Completed Successfully with response Count: {staffdetails.Count}");
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger.LogInformation($"GetAnnexureTwoDetailsByPFNo Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger.LogInformation("GetAnnexureTwoDetailsByPFNo Service No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"Error occured in GetAnnexureTwoDetailsByPFNo Service: {ex.Message}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsCO(string financialYear, string quarter)
        {
            try
            {
                logger?.LogInformation($"GetAnnexureTwoDetailsCO Service Started: FINANCIAL_YEAR:{financialYear}, QUATER:{quarter}");
                var staffdetails = await (from a1 in dbContext.SurpriseCashAnnexureOne
                                          join a2 in dbContext.SurpriseCashAnnexureTwo
                                          //on a1.SV_BRANCH_CODE + a1.FINANCIAL_YEAR + a1.QUATER + a1.BRANCH_PFNO equals a2.SV_BRANCH_CODE + a2.FINANCIAL_YEAR + a2.QUATER + a2.CREATED_BY
                                          on new { a1.REF_NO }
                                          equals new { a2.REF_NO }
                                          into annexureTwoGroup
                                          from a2 in annexureTwoGroup.DefaultIfEmpty() // This ensures the LEFT JOIN
                                          where a1.IS_DELETED == "N" && a2.ANNEXURE_STATUS_ZO == "Not Complied By ZO" && a2.FINANCIAL_YEAR == financialYear && a2.QUATER == quarter
                                          select new
                                          {
                                              AnnexureOneData = a1,
                                              AnnexureTwoData = a2, // This could be null if there's no match
                                          }).OrderByDescending(x => x.AnnexureOneData.REF_NO).ToListAsync();
                logger?.LogInformation($"GetAnnexureTwoDetailsCO Service query executed & response count is: {staffdetails.Count}");
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger?.LogInformation($"GetAnnexureTwoDetailsCO Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger?.LogInformation($"GetAnnexureTwoDetailsCO Service No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in GetAnnexureTwoDetailsCO Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByCO(string zonecode, string currentFinalcialYear, string currentQuater)
        {
            try
            {
                logger.LogInformation($"GetAnnexureTwoDetailsByCO Service Started:ZONE_CODE:{zonecode},FINANCIAL_YEAR:{currentFinalcialYear},QUATER:{currentQuater}");
                var annexureTwoQuery = $@"
        select * from surprise_cash_annexure_2 
        where FINANCIAL_YEAR = '{currentFinalcialYear}' and QUATER = '{currentQuater}' AND (ZONE_CODE = '{zonecode}' or ANNEXURE_STATUS_RO !='Complied By RO') ";
                var AnnexureTwoData = await dbContext.Set<SURPRISE_CASH_ANNEXURE_2>().FromSqlRaw(annexureTwoQuery).ToListAsync();

                // extract REF_NO list
                var refNos = AnnexureTwoData.Select(x => x.REF_NO).Distinct().ToList();
                //fetech only matching annexureOne rows
                var AnnexureOneData = await dbContext.Set<SURPRISE_CASH_ANNEXURE_1>().Where(x => refNos.Contains(x.REF_NO)).ToListAsync();
                var staffdetails = (from a1 in AnnexureOneData
                                    join a2 in AnnexureTwoData
                              on a1.REF_NO equals a2.REF_NO
                                    orderby a2.REF_NO descending
                                    select new
                                    {
                                        AnnexureOneData = a1,
                                        AnnexureTwoData = a2,
                                    }).ToList();
                //var staffdetails = (from a1 in dbContext.SurpriseCashAnnexureOne
                //                    join a2 in dbContext.SurpriseCashAnnexureTwo on a1.REF_NO equals a2.REF_NO into annexureTwoGroup
                //                    from a2 in annexureTwoGroup.DefaultIfEmpty()
                //                    where a2.ZONE_CODE == zonecode || a2.ANNEXURE_STATUS_RO != "Complied By RO"
                //                    select new
                //                    {
                //                      AnnexureOneData = a1,
                //                      AnnexureTwoData = a2,
                //                    }).ToListAsync();
                logger.LogInformation($"GetAnnexureTwoDetailsByCO Service response count:{staffdetails.Count}");
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger.LogInformation($"GetAnnexureTwoDetailsByCO Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger.LogInformation($"GetAnnexureTwoDetailsByCO Service, No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger.LogInformation($"Error in GetAnnexureTwoDetailsByCO Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByZoneCode(string zoneCode, string? Quater)
        {
            try
            {
                logger?.LogInformation($"GetAnnexureTwoDetailsByZoneCode Service Started(Discrepancies Report - ZO): ZONE_CODE:{zoneCode}, QUATER:{Quater}");
                var staffdetails = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.ZONE_CODE == zoneCode && x.QUATER == Quater).ToListAsync();
                logger?.LogInformation($"GetAnnexureTwoDetailsByZoneCode Service, staffdetails response count:{staffdetails.Count}");

                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger?.LogInformation($"GetAnnexureTwoDetailsByZoneCode Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger?.LogInformation($"GetAnnexureTwoDetailsByZoneCode Service, No record Found");
                    return (false, null, "No record Found");
                }

            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in GetAnnexureTwoDetailsByZoneCode Service, {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, "", realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureTwoDetailsByBranchCode(int ReqParameter)
        {
            try
            {
                logger.LogInformation($"GetAnnexureTwoDetailsByBranchCode(Branch SCV report- View-IO,DYRH,BH,ZO,CO) Service Started: a2.REF_NO:{ReqParameter}");
                var staffdetails = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.REF_NO == ReqParameter).FirstOrDefaultAsync();
                logger.LogInformation($"Executed SurpriseCashAnnexureTwo query GetAnnexureTwoDetailsByBranchCode Service");
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger.LogInformation($"GetAnnexureTwoDetailsByBranchCode Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger.LogInformation($"GetAnnexureTwoDetailsByBranchCode Service, No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger.LogInformation($"Error in GetAnnexureTwoDetailsByBranchCode Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureOneDetails(string ReqParameter)
        {
            try
            {
                var staffdetails = await dbContext.SurpriseCashAnnexureOne.Where(x => x.CREATED_BY == ReqParameter && x.IS_DELETED == "N").ToListAsync();
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
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureOneDetailsByPFno(string ReqParameter, string financialYear, string quarter)
        {
            try
            {
                logger?.LogInformation($"GetAnnexureOneDetailsByPFno(Branch SCV report-IO) Service Started financialYear: {financialYear}, quater: {quarter},a1.BRANCH_PFNO:{ReqParameter}");
                var staffdetails = await (from a1 in dbContext.SurpriseCashAnnexureOne
                                          join a2 in dbContext.SurpriseCashAnnexureTwo on a1.REF_NO equals a2.REF_NO into annexureTwoGroup
                                          from a2 in annexureTwoGroup.DefaultIfEmpty()
                                          where a1.BRANCH_PFNO == ReqParameter && a1.IS_DELETED == "N" && a2.IS_DELETED == "N" && a2.FINANCIAL_YEAR == financialYear && a2.QUATER == quarter
                                          select new
                                          {
                                              AnnexureOneData = a1,
                                              AnnexureTwoData = a2,
                                          }).ToListAsync();
                logger?.LogInformation($"GetAnnexureOneDetailsByPFno Service response count: {staffdetails.Count}");
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger?.LogInformation($"GetAnnexureOneDetailsByPFno Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger?.LogInformation($"GetAnnexureOneDetailsByPFno Service No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in GetAnnexureOneDetailsByPFno Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureOneDetailsBySVBranchCode(string ReqParameter, string Current, string financialYear, string quarter, string regionCode)
        {
            try
            {
                logger?.LogInformation($"GetAnnexureOneDetailsBySVBranchCode Service(BH-Branch SCV report) Started, financialYear: {financialYear}, quater: {quarter},SV_BRANCH_CODE:{ReqParameter} a2.REGION_CODE: {regionCode}");
                var staffdetails = await (from a1 in dbContext.SurpriseCashAnnexureOne
                                          join a2 in dbContext.SurpriseCashAnnexureTwo on a1.REF_NO equals a2.REF_NO into annexureTwoGroup
                                          from a2 in annexureTwoGroup.DefaultIfEmpty()
                                              //where a2.REGION_CODE == regionCode
                                          where (a1.SV_BRANCH_CODE == ReqParameter || a1.IO_BRANCH_CODE == ReqParameter)
                                          //where a1.SV_BRANCH_CODE == ReqParameter 
                                          && a1.IS_DELETED == "N" && a2.FINANCIAL_YEAR == financialYear && a2.QUATER == quarter
                                          select new
                                          {
                                              AnnexureOneData = a1,
                                              AnnexureTwoData = a2,
                                          }).ToListAsync();
                logger?.LogInformation($"GetAnnexureOneDetailsBySVBranchCode Service response count: {staffdetails.Count}");
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger?.LogInformation($"GetAnnexureOneDetailsBySVBranchCode Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger?.LogInformation($"GetAnnexureOneDetailsBySVBranchCode Service, No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in GetAnnexureOneDetailsBySVBranchCode Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetApprovedAnnexureTwoDetails(string ReqParameter, string code, string quater, string iszone, string financialYear, string currentUser)
        {
            try
            {
                logger.LogInformation($"GetApprovedAnnexureTwoDetails Service Started financialYear: {financialYear}, quater: {quater}, currentLoginUser: {currentUser},a2.ANNEXURE_STATUS:{ReqParameter},iszone:{iszone},ZONE_CODE:{code}");
                var staffdetails = await (from a2 in dbContext.SurpriseCashAnnexureTwo
                                          join a1 in dbContext.SurpriseCashAnnexureOne
                                          //on a2.SV_BRANCH_CODE + a2.CREATED_BY equals a1.SV_BRANCH_CODE + a1.BRANCH_PFNO into annexureTwoGroup
                                          on a2.REF_NO equals a1.REF_NO into annexureTwoGroup
                                          from a1 in annexureTwoGroup.DefaultIfEmpty()
                                          where a2.ANNEXURE_STATUS == ReqParameter && a2.QUATER == quater && a2.FINANCIAL_YEAR == financialYear && (iszone == "Yes" ? a2.ZONE_CODE == code : a2.REGION_CODE == code || a2.QUATER == quater)
                                           && a1.CREATED_BY == currentUser
                                          select new
                                          {
                                              AnnexureOneData = a1,
                                              AnnexureTwoData = a2,
                                          }).ToListAsync();
                logger.LogInformation($"GetApprovedAnnexureTwoDetails Completed Successfully with response count: {staffdetails.Count}");
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger.LogInformation($"GetApprovedAnnexureTwoDetails Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger.LogInformation($"GetApprovedAnnexureTwoDetails else");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger.LogInformation($"Error in GetApprovedAnnexureTwoDetails: {ex.Message}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureFiveDetails()
        {
            try
            {
                var staffdetails = await (from a2 in dbContext.SurpriseCashAnnexureTwo
                                          join a1 in dbContext.SurpriseCashAnnexureOne
                                          on a2.SV_BRANCH_CODE equals a1.SV_BRANCH_CODE into annexureTwoGroup
                                          from a1 in annexureTwoGroup.DefaultIfEmpty()
                                          select new
                                          {
                                              AnnexureOneData = a1,
                                              AnnexureTwoData = a2,
                                          }).ToListAsync();
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
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAnnexureFourDetails(string status, string code)
        {
            try
            {
                var staffdetails = await dbContext.SurpriseCashAnnexureFour.Where(x => x.ANNEXURE_STATUS == status && x.ZONE_CODE == code).ToListAsync();
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
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetRegionDetails(string zoneCode)
        {
            try
            {
                var staffdetails = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.ZONE_CODE == zoneCode).Select(x => new { x.REGION_CODE, x.REGION_NAME }).Distinct().ToListAsync();
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
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetApprovedAnnexureFourDetails(string ReqParameter, string zonecode, string iszone, string year, string quater)
        {
            try
            {
                logger?.LogInformation($"GetApprovedAnnexureFourDetails Service(Consolidated Report of Zonal Office-ZO,CO(Approved-Status)) Started, a2.ANNEXURE_STATUS: {ReqParameter},REGION_CODE:{zonecode}, QUATER:{quater},FINANCIAL_YEAR:{year}");
                var staffdetails = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.ANNEXURE_STATUS == ReqParameter && (iszone == "Yes" ? x.ZONE_CODE == zonecode : x.REGION_CODE == zonecode || x.QUATER == quater) && x.FINANCIAL_YEAR == year && x.QUATER == quater).ToListAsync();
                logger?.LogInformation($"GetApprovedAnnexureFourDetails Service response count:{staffdetails.Count}");
                if (staffdetails != null)
                {
                    string staffDetailsJson = JsonConvert.SerializeObject(staffdetails);
                    string res = EncryptoData.EncryptString(staffDetailsJson);
                    logger?.LogInformation($"GetApprovedAnnexureFourDetails Service Ended");
                    return (true, res, null);
                }
                else
                {
                    logger?.LogInformation($"GetApprovedAnnexureFourDetails Service, No record Found");
                    return (false, null, "No record Found");
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation($"Error in GetApprovedAnnexureFourDetails Service: {ex}");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? organisations, string? Msg)> GetAllAnnexureOneData(string currentYear, string currentQuarter, string regionCode)
        {
            try
            {
                var staffdetails = await (from a1 in dbContext.SurpriseCashAnnexureOne
                                          join a2 in dbContext.SurpriseCashAnnexureTwo
                                          on new { a1.REF_NO }
                                          equals new { a2.REF_NO }
                                          into annexureTwoGroup
                                          from a2 in annexureTwoGroup.DefaultIfEmpty()
                                          where a1.IS_DELETED == "N" && a1.FINANCIAL_YEAR == currentYear && a1.QUATER == currentQuarter && a2.REGION_CODE == regionCode
                                          select new
                                          {
                                              AnnexureOneData = a1
                                          }).OrderByDescending(x => x.AnnexureOneData.REF_NO).ToListAsync();

                //dbContext.SurpriseCashAnnexureOne.Where(x => x.IS_DELETED == "N" && x.FINANCIAL_YEAR == currentYear && x.QUATER == currentQuarter).OrderByDescending(x => x.SV_BRANCH_CODE).ToListAsync();
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
                return (false, null, realerror.Message);
            }
        }

        public async Task<(bool IsSuccess, string? Msg)> DeleteAnnexureTwoData(int RefNo, string userid)
        {
            try
            {
                var exist = dbContext.SurpriseCashAnnexureTwo.Where(e => e.REF_NO == RefNo).FirstOrDefault();

                if (exist != null)
                {
                    exist.DELETED_BY = userid;
                    exist.DELETED_ON = DateTime.Now;
                    exist.IS_DELETED = "Y";
                    exist.ANNEXURE_STATUS = "Deleted";
                    dbContext.SurpriseCashAnnexureTwo.Update(exist);
                    dbContext.SaveChanges();
                    var exist1 = dbContext.SurpriseCashAnnexureOne.Where(e => e.REF_NO == RefNo).FirstOrDefault();
                    if (exist1 != null)
                    {
                        exist1.DELETED_BY = userid;
                        exist1.DELETED_ON = DateTime.Now;
                        exist1.IS_DELETED = "Y";
                        dbContext.SurpriseCashAnnexureOne.Update(exist1);
                        dbContext.SaveChanges();

                    }
                    return (true, "Deleted Successfully");
                }
                else
                {
                    return (false, "Record not found");
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

        public async Task<(bool IsSuccess, string? Msg)> DeleteAnnexureOneData(int RefNo, string userid)
        {
            try
            {
                var exist = dbContext.SurpriseCashAnnexureOne.Where(e => e.REF_NO == RefNo).FirstOrDefault();

                if (exist != null)
                {
                    exist.DELETED_BY = userid;
                    exist.DELETED_ON = DateTime.Now;
                    exist.IS_DELETED = "Y";
                    dbContext.SurpriseCashAnnexureOne.Update(exist);
                    dbContext.SaveChanges();

                    //SurpriseCashAnnexureTwo table

                    var exist2 = dbContext.SurpriseCashAnnexureTwo.Where(e => e.NAME_OF_INSPECTING_OFFICER == exist.TO_BRANCH_OFFICER_NAME).FirstOrDefault();

                    if (exist2 != null)
                    {
                        exist2.DELETED_BY = userid;
                        exist2.DELETED_ON = DateTime.Now;
                        exist2.IS_DELETED = "Y";
                        dbContext.SurpriseCashAnnexureTwo.Update(exist2);
                        dbContext.SaveChanges();
                    }
                    return (true, "Deleted Successfully");
                }
                else
                {
                    return (false, "Record not found");
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

        public async Task<SurpriseDateResult> GetLatestSurpriseDateAsync(string svBranchCode)
        {
            //var result2 = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.SV_BRANCH_CODE == svBranchCode && x.DATE_OF_PREV_SURPRISE_VERIFICATION != null).OrderByDescending(x => x.REF_NO).
            //  Select(x => x.DATE_OF_PREV_SURPRISE_VERIFICATION).FirstOrDefaultAsync();

            //var result = await dbContext.SurpriseCashAnnexureTwo.Where(x => x.SV_BRANCH_CODE == svBranchCode &&
            //new[] { "Complied by CO", "Complied by ZO", "Complied By CO", "Complied By ZO" }
            //.Contains(x.ANNEXURE_STATUS_CO))
            //    .OrderByDescending(x => x.REF_NO).
            // Select(x => x.ACTION_TAKEN_CO_DATE).FirstOrDefaultAsync();

            var result = await dbContext.SurpriseCashAnnexureTwo
            .Where(x =>
                x.SV_BRANCH_CODE == svBranchCode
                && !string.IsNullOrEmpty(x.ANNEXURE_STATUS)
                && x.ANNEXURE_STATUS != "Deleted"
                && x.ANNEXURE_STATUS != "Saved"
                && x.DATE_OF_PREV_SURPRISE_VERIFICATION != null
            )
            .OrderByDescending(x => x.REF_NO)
            .Select(x => x.DATE_OF_PREV_SURPRISE_VERIFICATION)
            .FirstOrDefaultAsync();
            if (result != null)
            {
                return new SurpriseDateResult
                {
                    IsSuccess = true,
                    FormattedDate = result,//.Value.ToString("yyyy-MM-dd"),
                    Message = "Date Found"
                };
            }
            return new SurpriseDateResult
            {
                IsSuccess = false,
                Message = "No Valid date found"
            };
        }
        public void callurl(string url)
        {
            logger?.LogInformation("Inside callurl: " + url);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            WebRequest request = HttpWebRequest.Create(url);
            WebResponse response = request.GetResponse();
            return;
        }

        /*{
            "requestType": "0",
            "msgid": "84944877877878",
            "data": {
                "requestType": "cash_denonmination",
                "requestData": {
                    "Branch_code": "800015",
                    "Selection_type": "BOD"
                }
            }
        }*/
        public async Task<(bool IsSuccess, CashDetails? cashData, string? Msg)> GetDenominationsCashDetails(CashRequest request)
        {
            logger?.LogInformation($"GetCashDetails Service Started, Request Input is: {JsonConvert.SerializeObject(request)}");
            string key = configuration["ApiKey:API_key"].ToString();
            string Enc_URL = configuration["ApiKey:Enc_URL"].ToString();
            string Dec_URL = configuration["ApiKey:Dec_URL"].ToString();
            string msgid_str = DateTime.Now.ToString("HHmmyyyyssff");
            logger?.LogInformation($"API_key: {key}");
            logger?.LogInformation($"Enc_URL: {Enc_URL}");
            logger?.LogInformation($"Dec_URL: {Dec_URL}");

            var jsonObject = new JObject();
            dynamic album = jsonObject;
            album.requestType = "0";
            album.msgid = msgid_str;


            var reqdata = new JObject();
            reqdata.Add("Branch_code", request.BranchCode);
            reqdata.Add("Selection_type", request.SelectionType);

            var dataObj = new JObject();
            dataObj.Add("requestType", "cash_denonmination");
            dataObj.Add("requestData", reqdata);
            album.data = dataObj;

            var EncRequest = new Request();
            EncRequest.data = album.ToString().Trim();
            EncRequest.key = key;
            logger?.LogInformation("Request Obj ===>" + jsonObject);
            logger?.LogInformation("EncRequest" + EncRequest);

            var jsonData = JsonConvert.SerializeObject(EncRequest);

            string? encrypt_string = "";
            var data1 = new StringContent(jsonData, Encoding.UTF8, "application/json");
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

            using (var client = new HttpClient())
            {
                HttpResponseMessage response = await client.PostAsync(Enc_URL, data1);
                HttpContent content = response.Content;
                var EncResult = content.ReadAsStringAsync().Result.ToString();
                var Enc_Des_Result = JsonConvert.DeserializeObject<Request>(EncResult);
                encrypt_string = Enc_Des_Result?.data;
            }
            var jsonEncrypt = new JObject();
            jsonEncrypt.Add("reqdata", encrypt_string);
            jsonEncrypt.Add("msgid", msgid_str);

            var apiUrl = configuration["ApiKey:DenominationsCashDetails_URL"]?.ToString();
            logger?.LogInformation($"Json encrypted Response :{jsonEncrypt}");
            logger?.LogInformation($"CashDetails apiUrl :{apiUrl}");

            HttpWebRequest r = (HttpWebRequest)WebRequest.Create(apiUrl);
            try
            {
                r.Method = "POST";
                r.ContentType = "application/json";
                r.ContentLength = jsonEncrypt.ToString().Length;
                using (Stream webstream = r.GetRequestStream())
                using (StreamWriter requestWriter = new StreamWriter(webstream, System.Text.Encoding.ASCII))
                {
                    requestWriter.Write(jsonEncrypt);
                }
            }
            catch (Exception ex)
            {
                logger?.LogInformation("Error while posting Encrypted request");
                logger?.LogError(ex.ToString());
                Exception realerror = ex;
                while (realerror.InnerException != null)
                    realerror = realerror.InnerException;
                return (false, null, realerror.ToString());
            }
            try
            {
                WebResponse webResponse = r.GetResponse();
                using (Stream webStream = webResponse.GetResponseStream() ?? Stream.Null)
                using (StreamReader responseReader = new StreamReader(webStream))
                {
                    string response = responseReader.ReadToEnd();
                    var Dec_request = new Request();
                    Dec_request.data = response.ToString();
                    Dec_request.key = key;
                    logger?.LogInformation("Request Obj to finacle===>" + JsonConvert.SerializeObject(Dec_request));
                    JsonContent jsondata1 = JsonContent.Create(Dec_request);
                    HttpClientHandler clientHandler1 = new HttpClientHandler();
                    clientHandler1.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
                    using (var client = new HttpClient(clientHandler1))
                    {
                        HttpResponseMessage response1 = await client.PostAsync(Dec_URL, jsondata1);
                        HttpContent content = response1.Content;
                        var dec_result = content.ReadAsStringAsync().Result.ToString();
                        var dec_des_result = JsonConvert.DeserializeObject<Request>(dec_result);
                        var strData = dec_des_result?.data;
                        logger?.LogInformation("Response from finacle===>" + JsonConvert.SerializeObject(strData));


                        if (string.IsNullOrEmpty(strData) || strData == "null")
                        {
                            logger?.LogInformation("Data is not Found in Finacle.");
                            return (false, null, "Data is not Found in Finacle.");
                        }
                        else
                        {
                            logger?.LogInformation("Data   ==> " + strData?.ToString());
                            var obj = JObject.Parse(strData);
                            var status = obj["status"]?.ToString();
                            logger?.LogInformation($"Status is: {status}");
                            if (status == "00")
                            {
                                var dataToken = obj["data"];
                                if (dataToken == null || dataToken.Type == JTokenType.Null || dataToken.ToString() == "null")
                                {
                                    string errorMessage = obj["errorMessage"].ToString();
                                    logger?.LogInformation($"Error from Finacle: {errorMessage}");
                                    return (false, null, errorMessage);
                                }
                                else if (dataToken["Error"] != null || dataToken["ErrorDesc"] != null)
                                {
                                    try
                                    {
                                        string errorDesc = dataToken["Error"]["FIBusinessException"]["ErrorDetail"]["ErrorDesc"].ToString();
                                        logger?.LogInformation($"Error from Finacle: {errorDesc}");
                                        var error = $"Error from Finacle: {errorDesc}";
                                        return (false, null, error);
                                    }
                                    catch (Exception ex)
                                    {
                                        logger?.LogInformation($"Error from Finacle: {ex}");
                                        return (false, null, "Error from Finacle");
                                    }
                                }
                                else if (dataToken["data"] != null || dataToken["errorMessage"] != null)
                                {
                                    string errorMessage = dataToken["errorMessage"].ToString();
                                    logger?.LogInformation($"Error from Finacle: {errorMessage}");
                                    var error = $"Error from Finacle: {errorMessage}";
                                    return (false, null, error);
                                }
                                try
                                {
                                    JObject jObj = JObject.Parse(obj["data"].ToString());
                                    CashDetails cashDetails = new CashDetails
                                    {
                                        NOTES_2000 = int.Parse(jObj["NOTES_2000"]?.ToString()),
                                        NOTES_500 = int.Parse(jObj["NOTES_500"]?.ToString()),
                                        NOTES_200 = int.Parse(jObj["NOTES_200"]?.ToString()),
                                        NOTES_100 = int.Parse(jObj["NOTES_100"]?.ToString()),
                                        NOTES_50 = int.Parse(jObj["NOTES_50"]?.ToString()),
                                        NOTES_20 = int.Parse(jObj["NOTES_20"]?.ToString()),
                                        NOTES_10 = int.Parse(jObj["NOTES_10"]?.ToString()),
                                        NOTES_5 = int.Parse(jObj["NOTES_5"]?.ToString()),
                                        NOTES_2 = int.Parse(jObj["NOTES_2"]?.ToString()),
                                        NOTES_1 = int.Parse(jObj["NOTES_1"]?.ToString()),

                                        COINS_20 = int.Parse(jObj["COINS_20"]?.ToString()),
                                        COINS_10 = int.Parse(jObj["COINS_10"]?.ToString()),
                                        COINS_5 = int.Parse(jObj["COINS_5"]?.ToString()),
                                        COINS_2 = int.Parse(jObj["COINS_2"]?.ToString()),
                                        COINS_1 = int.Parse(jObj["COINS_1"]?.ToString()),
                                        COINS_50_PAISA = int.Parse(jObj["COINS_50PAISE"]?.ToString()),
                                        SelectionTypeDate = DateTime.ParseExact(jObj["SelectionTypeDate"]?.ToString(), "dd-MM-yyyy", CultureInfo.InvariantCulture)
                                    };
                                    cashDetails.Total2000Amount = GetAmount(cashDetails.NOTES_2000, 2000);
                                    cashDetails.Total500Amount = GetAmount(cashDetails.NOTES_500, 500);
                                    cashDetails.Total200Amount = GetAmount(cashDetails.NOTES_200, 200);
                                    cashDetails.Total100Amount = GetAmount(cashDetails.NOTES_100, 100);
                                    cashDetails.Total50Amount = GetAmount(cashDetails.NOTES_50, 50);
                                    cashDetails.Total20Amount = GetAmount(cashDetails.NOTES_20, 20);
                                    cashDetails.Total10Amount = GetAmount(cashDetails.NOTES_10, 10);
                                    cashDetails.Total5Amount = GetAmount(cashDetails.NOTES_5, 5);
                                    cashDetails.Total2Amount = GetAmount(cashDetails.NOTES_2, 2);
                                    cashDetails.Total1Amount = GetAmount(cashDetails.NOTES_1, 1);
                                    cashDetails.Total20AmountCoins = GetAmount(cashDetails.COINS_20, 20);
                                    cashDetails.Total10AmountCoins = GetAmount(cashDetails.COINS_10, 10);
                                    cashDetails.Total5AmountCoins = GetAmount(cashDetails.COINS_5, 5);
                                    cashDetails.Total2AmountCoins = GetAmount(cashDetails.COINS_2, 2);
                                    cashDetails.Total1AmountCoins = GetAmount(cashDetails.COINS_1, 1);
                                    cashDetails.Total50PaisaAmountCoins = GetAmountDecimal(cashDetails.COINS_50_PAISA, 0.5m);

                                    cashDetails.TotalSum =
                                        cashDetails.Total2000Amount + cashDetails.Total500Amount +
                                        cashDetails.Total200Amount + cashDetails.Total100Amount +
                                        cashDetails.Total50Amount + cashDetails.Total20Amount +
                                        cashDetails.Total10Amount + cashDetails.Total5Amount +
                                        cashDetails.Total2Amount + cashDetails.Total1Amount +
                                        cashDetails.Total20AmountCoins + cashDetails.Total10AmountCoins +
                                        cashDetails.Total5AmountCoins + cashDetails.Total2AmountCoins +
                                        cashDetails.Total1AmountCoins + cashDetails.Total50PaisaAmountCoins;
                                    int GetAmount(int? count, int denomination) => count.HasValue ? count.Value * denomination : 0;
                                    decimal GetAmountDecimal(int? count, decimal denomination) => count.HasValue ? count.Value * denomination : 0m;
                                    logger?.LogInformation($"Total cash calculated: {cashDetails.TotalSum}");
                                    logger?.LogInformation("CashDetails Service Ended");
                                    return (true, cashDetails, "Cash data found");
                                }
                                catch (Exception ex)
                                {
                                    logger?.LogInformation($"Error from Finacle: {ex}");
                                    return (false, null, "Error from Finacle");
                                }
                            }
                            else
                            {
                                var errMsg = obj["errorMsg"]?.ToString();
                                logger?.LogInformation($"Error from APIM: {errMsg} and Status is: {status}");
                                return (false, null, "Error from APIM :" + errMsg);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Error occurred while getting cash details.");
                logger?.LogError(ex.ToString());
                return (false, null, "Cash data not found due to error");
            }
        }

        public async Task<(bool IsSuccess, LOGIN_TYPE? organisations, string? Msg)> GetLogInTypeAsync(string emp_desgn)
        {
            logger?.LogInformation($"GetLogInTypeAsync Service Started, Request Input emp_desgn is: {emp_desgn}");
            var response = await dbContext.LOGIN_TYPE.FirstOrDefaultAsync(x => x.EMP_DESGN == emp_desgn);
            if (response is null)
            {
                logger?.LogInformation($"GetLogInTypeAsync Service response is null");
                return (false, null, "Not Allow");
            }
            logger?.LogInformation($"GetLogInTypeAsync Service Ended");
            return (true, response, "Allow");
        }

        public async Task<(bool IsSuccess, LOGIN_TYPE? organisations, string? Msg)> GetCOLogInAsync(string location, string emp_id)
        {
            logger?.LogInformation($"GetCOLogInAsync Service Started, Request Input location is: {location} and emp_id: {emp_id}");
            var response = await dbContext.LOGIN_TYPE.FirstOrDefaultAsync(x => x.EMP_ID == emp_id); //x.LOCATION == location  &&
            if (response is null)
            {
                logger?.LogInformation($"GetCOLogInAsync Service response is null");
                return (false, null, "Not Allow");
            }
            logger?.LogInformation($"GetCOLogInAsync Service Ended");
            return (true, response, "Allow");
        }

        public class Request
        {
            public string? data { get; set; }
            public string? key { get; set; }
        }
    }
}
