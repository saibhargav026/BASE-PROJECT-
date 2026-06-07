using Surprise_Cash_Verification.Core.Tables.Master;
using Microsoft.EntityFrameworkCore;

namespace Surprise_Cash_Verification.DbConn
{
    public class OrganisationsDbContext : DbContext
    {
        public DbSet<StaffDetails> organisations { get; set; }
        public DbSet<ZoneMaster> zone_master { get; set; }
        public DbSet<RegionMaster> region_master { get; set; }
        public DbSet<Branch_master> Branch_master { get; set; }
        public DbSet<Questions> login_question { get; set; }
        public DbSet<StaffDetails2> StaffDetails { get; set; }
        public OrganisationsDbContext(DbContextOptions<OrganisationsDbContext> options) : base(options)
            {

            }
        }
}
