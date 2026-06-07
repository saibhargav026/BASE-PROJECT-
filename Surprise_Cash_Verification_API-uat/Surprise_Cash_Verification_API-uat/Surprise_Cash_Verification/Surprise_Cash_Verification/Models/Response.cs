namespace Surprise_Cash_Verification.Models
{
    public class Response<T>
    {
        public string? status { get; set; }
        public string? Message { get; set; }
        public List<T>? Data { get; set; }
        public T? rData { get; set; }

    }
}
