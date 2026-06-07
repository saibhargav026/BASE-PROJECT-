using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("SURPRISE_CASH_ANNEXURE_2")]
    public class SURPRISE_CASH_ANNEXURE_2
    {
        [Key]
        public int REF_NO { get; set; }
        public string? NAME_OF_INSPECTING_OFFICER { get; set; }
        public string? NAME_OF_BRANCH { get; set; }
        public string? DATE_OF_PREV_SURPRISE_VERIFICATION { get; set; }
        public string? OPENING_CLOSING_OF_BUSINESS { get; set; }
        public string? OPENING_CLOSING_OF_BUSINESS_AMOUNT { get; set; }
        public string? SAFE_CUSTODY_RECEIPT { get; set; }
        public string? SAFE_CUSTODY_RECEIPT_DATED { get; set; }
        public string? STAMPED_AGREEMENT_FORMS { get; set; }
        public string? STAMPED_AGREEMENT_FORMS_AMOUNT { get; set; }
        public string? NO_OF_POST_PARCELS_HELD_BY_BRANCH { get; set; }
        public string? POST_PARCELS_HELD_BY_BRANCH { get; set; }
        public string? POSTAL_STAMPS { get; set; }
        public string? POSTAL_STAMPS_AMOUNT { get; set; }
        public string? MONTHLY_CASH_VERIFICATION_OF_CASH { get; set; }
        public string? PERIODICAL_SURPRISE_CHECK { get; set; }
        public string? KEPT_UNDER_JOINT_CUSTODY { get; set; }
        public string? JOINT_CUSTODIAN_VERIFYING { get; set; }
        public string? OTHER_GUIDELINES_COMPILED { get; set; }
        public string? KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY { get; set; }
        public string? KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED { get; set; }
        public string? KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS { get; set; }
        public string? KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_DATE { get; set; }
        public string? KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS { get; set; }
        public string? SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH { get; set; }
        public string? SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM { get; set; }
        public string? SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM { get; set; }
        public string? WHETHER_ULTRAVIOLET_LAMP_PROVIDED { get; set; }
        public string? WHETHER_ULTRAVIOLET_LAMP_WORKING { get; set; }
        public string? CCTV_SYSTEM_IS_PROVIDED { get; set; }
        public string? CCTV_SYSTEM_IS_WORKING { get; set; }
        public string? CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE { get; set; }
        public string? CASH_COUNTING_MACHINE_PROVIDED { get; set; }
        public string? CASH_COUNTING_MACHINE_WORKING { get; set; }
        public string? NOTE_SORTING_MACHINE_PROVIDED { get; set; }
        public string? NOTE_SORTING_MACHINE_WORKING { get; set; }
        public string? SECURITY_GUARD_IS_INVOLVED { get; set; }
        public string? SECURITY_GUARD_IS_INVOLVED_DETAILS { get; set; }
        public string? WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH { get; set; }
        public string? PHYSICAL_CASH_IN_ATM_VERIFIED { get; set; }
        public string? DISCREPANCIES { get; set; }
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }
        public string? UNIQUE_ID { get; set; }
        public int? NOTES_2000 { get; set; }
        public int? NOTES_500 { get; set; }
        public int? NOTES_200 { get; set; }
        public int? NOTES_100 { get; set; }
        public int? NOTES_50 { get; set; }
        public int? NOTES_20 { get; set; }
        public int? NOTES_10 { get; set; }
        public int? NOTES_5 { get; set; }
        public int? NOTES_2 { get; set; }
        public int? NOTES_1 { get; set; }
        public int? COINS_10 { get; set; }
        public int? COINS_5 { get; set; }
        public int? COINS_2 { get; set; }
        public int? COINS_1 { get; set; }
        public int? COINS_50_PAISA { get; set; }
        public string? SAFE_CUSTODY_RECEIPTNAME { get; set; }
        public string? SOILED_NOTES_AMT { get; set; }
        //public int? SV_BRANCH_CODE { get; set; }
        public string? SV_BRANCH_CODE { get; set; }
        public string? ANNEXURE_COMMENT { get; set; }
        public string? ANNEXURE_STATUS { get; set; }
        public string? REGION_CODE { get; set; }
        public string? ZONE_CODE { get; set; }
        public string? FINANCIAL_YEAR { get; set; }
        public string? QUATER { get; set; }
        public string? KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO { get; set; }
        public string? KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO { get; set; }
        public string? KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO { get; set; }
        public string? KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO { get; set; }
        public string? SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO { get; set; }
        public string? WHETHER_ULTRAVIOLET_LAMP_PROVIDED_NO { get; set; }
        public string? WHETHER_ULTRAVIOLET_LAMP_WORKING_NO { get; set; }
        public string? CCTV_SYSTEM_IS_PROVIDED_NO { get; set;}
        public string? CCTV_SYSTEM_IS_WORKING_NO { get; set;}
        public string? CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE_NO { get; set; }
        public string? CASH_COUNTING_MACHINE_PROVIDED_NO { get; set;}
        public string? CASH_COUNTING_MACHINE_WORKING_NO { get; set;}
        public string? WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_DATE { get; set; }
        public string? WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO { get; set; }
        public string? PHYSICAL_CASH_IN_ATM_VERIFIED_DATE { get; set; }
        public string? PHYSICAL_CASH_IN_ATM_VERIFIED_NO { get; set; }

        public string? ACTION_TAKEN_BY_BRANCH { get; set; }
        public DateTime? ACTION_TAKEN_BRANCH_DATE { get; set; }
        public string? ACTION_TAKEN_BRANCH_ID { get; set; }
        public string? ANNEXURE_STATUS_BRANCH { get; set; }



        public string? ACTION_TAKEN_BY_RO { get; set; }
        public DateTime? ACTION_TAKEN_RO_DATE { get; set; }
        public string? ACTION_TAKEN_RO_ID { get; set; }
        public string? ANNEXURE_STATUS_RO { get; set; }

        public string? ACTION_TAKEN_BY_ZO { get; set; }
        public DateTime? ACTION_TAKEN_ZO_DATE { get; set; }
        public string? ACTION_TAKEN_ZO_ID { get; set; }
        public string? ANNEXURE_STATUS_ZO { get; set; }
        public string? ACTION_TAKEN_BY_CO { get; set; }
        public DateTime? ACTION_TAKEN_CO_DATE { get; set; }
        public string? ACTION_TAKEN_CO_ID { get; set; }
        public string? ANNEXURE_STATUS_CO { get; set; }
        public string? ZONE_NAME { get; set; }
        public string? REGION_NAME { get; set; }
        public int? COINS_20 { get; set; }
        public string? IP_ADDRESS { get; set; }
        public string? DELETED_BY { get; set; }
        public DateTime? DELETED_ON { get; set; }
        public string? IS_DELETED { get; set; }
        public string? IS_DISABLE { get; set; }
        public string? WHETHERMACHINESORTEDNOTES { get; set; }
        public string? WHETHERMACHINESORTEDNOTESNO { get; set; }
        public string? WHETHERAVAITABITITYOFNAM {  get; set; }
        public string? WHETHERAVAITABITITYOFNAMNO { get; set; }
        public string? WHETHERFIR {  get; set; }
        public string? WHETHERFIRNO { get; set; }
        public string? MONTHTYCONSOTIDATEDREPORT { get; set; }
        public string? MONTHTYCONSOTIDATEDREPORTNO { get; set; }
        public string? CASH_SELECTION_TYPE { get; set; } //BOD  OR EOD
    }
}
