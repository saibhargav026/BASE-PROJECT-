namespace Surprise_Cash_Verification.Models
{
    public class CashDetails
    {
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
        public int? COINS_20 { get; set; }
        public DateTime? SelectionTypeDate { get; set; }

        public int? Total2000Amount { get; set; }
        public int? Total500Amount { get; set; }
        public int? Total200Amount { get; set; }
        public int? Total100Amount { get; set; }
        public int? Total50Amount { get; set; }
        public int? Total20Amount { get; set; }
        public int? Total10Amount { get; set; }
        public int? Total5Amount { get; set; }
        public int? Total2Amount { get; set; }
        public int? Total1Amount { get; set; }
        public int? Total10AmountCoins { get; set; }
        public int? Total5AmountCoins { get; set; }
        public int? Total2AmountCoins { get; set; }
        public int? Total1AmountCoins { get; set; }
        public decimal? Total50PaisaAmountCoins { get; set; }
        public int? Total20AmountCoins { get; set; }
        public decimal? TotalSum { get; set; }
    }
}
