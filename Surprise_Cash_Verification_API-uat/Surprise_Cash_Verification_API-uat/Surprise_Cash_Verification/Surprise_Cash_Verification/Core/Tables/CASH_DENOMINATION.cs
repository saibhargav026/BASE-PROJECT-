using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Surprise_Cash_Verification.Core.Tables
{
    [Table("CASH_DENOMINATION")]
    public class CASH_DENOMINATION : BaseEntity
    {
        [Key]
        public int REF_NO { get; set; }
        public string? BRANCH_NAME { get; set; }
        public string? REGION_NAME { get; set; }
        public string? NAME_OF_OFFICIER_NOMINATION { get; set; }
        public string? SINGLE_LOCK_NOTE_2000 { get; set; }
        public string? SINGLE_LOCK_NOTE_500 { get; set; }
        public string? SINGLE_LOCK_NOTE_200 { get; set; }
        public string? SINGLE_LOCK_NOTE_50 { get; set; }
        public string? SINGLE_LOCK_NOTE_20 { get; set; }
        public string? SINGLE_LOCK_NOTE_10 { get; set; }
        public string? SINGLE_LOCK_NOTE_5 { get; set; }
        public string? SINGLE_LOCK_NOTE_2 { get; set; }
        public string? SINGLE_LOCK_NOTE_1 { get; set; }
        public string? SINGLE_LOCK_COIN_10 { get; set; }
        public string? SINGLE_LOCK_COIN_5 { get; set; }
        public string? SINGLE_LOCK_COIN_2 { get; set; }
        public string? SINGLE_LOCK_COIN_1 { get; set; }
        public string? SINGLE_LOCK_COIN_50P { get; set; }
        public string? SINGLE_LOCK_GRAND_TOTAL { get; set; }
        public string? DOUBLE_LOCK_NOTE_2000 { get; set; }
        public string? DOUBLE_LOCK_NOTE_500 { get; set; }
        public string? DOUBLE_LOCK_NOTE_200 { get; set; }
        public string? DOUBLE_LOCK_NOTE_50 { get; set; }
        public string? DOUBLE_LOCK_NOTE_20 { get; set; }
        public string? DOUBLE_LOCK_NOTE_10 { get; set; }
        public string? DOUBLE_LOCK_NOTE_5 { get; set; }
        public string? DOUBLE_LOCK_NOTE_2 { get; set; }
        public string? DOUBLE_LOCK_NOTE_1 { get; set; }
        public string? DOUBLE_LOCK_COIN_10 { get; set; }
        public string? DOUBLE_LOCK_COIN_5 { get; set; }
        public string? DOUBLE_LOCK_COIN_2 { get; set; }
        public string? DOUBLE_LOCK_COIN_1 { get; set; }
        public string? DOUBLE_LOCK_COIN_50P { get; set; }
        public string? DOUBLE_LOCK_GRAND_TOTAL { get; set; }
        public string? UNIQUE_ID { get; set; }
        public string? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public string? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }

    }
}
