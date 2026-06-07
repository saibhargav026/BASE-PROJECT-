namespace Surprise_Cash_Verification.Models
{
    public class AddStaffRequestDto
    {
        public string? EmployeeLocationCode { get; set; }
        public string? EmployeeLocationDescription { get; set; }
        public string? EmployeeDesignationCode { get; set; }
        public string? EmployeeDesignationDescription { get; set; }
        public string UserType { get; set; }
        public string Status { get; set; }
        public string? EmployeeId { get; set; }
    }
}
