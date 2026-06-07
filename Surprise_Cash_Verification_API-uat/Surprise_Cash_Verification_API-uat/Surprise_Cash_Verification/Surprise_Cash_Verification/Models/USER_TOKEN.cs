using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Surprise_Cash_Verification.Models
{
    [Table("USER_TOKEN")]
    public class USER_TOKEN
    {
        [Key]
        [Column("REF_NO")]
        public int REF_NO { get; set; }
        public string? USERID { get; set; }
        public string? USERNAME { get; set; }
        public string? LASTTOKEN { get; set; }
        public string? HASH_TOKEN { get; set; }// To store the current active token
    }
}
