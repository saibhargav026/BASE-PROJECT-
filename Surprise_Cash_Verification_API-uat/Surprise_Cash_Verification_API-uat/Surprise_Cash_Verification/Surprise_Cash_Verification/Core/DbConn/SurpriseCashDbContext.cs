using Microsoft.EntityFrameworkCore;
using Surprise_Cash_Verification.Core.Tables;
using Surprise_Cash_Verification.Models;

namespace Surprise_Cash_Verification.Core.DbConn
{
    public class SurpriseCashDbContext : DbContext
    {
        public DbSet<SURPRISE_CASH_ANNEXURE_1> SurpriseCashAnnexureOne { get; set; }
        public DbSet<SURPRISE_CASH_ANNEXURE_2> SurpriseCashAnnexureTwo { get; set; }
        public DbSet<SURPRISE_CASH_ANNEXURE_3> SurpriseCashAnnexureThree { get; set; }
        public DbSet<SURPRISE_CASH_ANNEXURE_4> SurpriseCashAnnexureFour { get; set; }
        public DbSet<STATUS_OF_REPORT_BY_DYRH> StatusOfReportByDYRH { get; set; }
        public DbSet<BRANCH_USER_ACCESS> BranchUserAccess { get; set; }
        public DbSet<USER_TOKEN> USER_TOKEN { get; set; }
        public DbSet<LOGIN_TYPE> LOGIN_TYPE { get; set; }
        public DbSet<STAFF_ROLES> STAFF_ROLES { get; set; }
        public SurpriseCashDbContext(DbContextOptions<SurpriseCashDbContext> options) : base(options)
        {

        }
    }
}
