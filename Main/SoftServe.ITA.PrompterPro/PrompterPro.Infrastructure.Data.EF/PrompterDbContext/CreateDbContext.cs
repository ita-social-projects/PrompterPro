using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Common;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext
{
    public class CreateDbContext : DbContext
    {
        private const string ConnectionStringName = "name=DbConnectionString";

        public IDbSet<History> Histories { get; set; }
        public IDbSet<Options> Options { get; set; }
        public IDbSet<Role> Roles { get; set; }
        public IDbSet<Script> Scripts { get; set; }
        public IDbSet<Section> Sections { get; set; }
        public IDbSet<User> Users { get; set; }
        public IDbSet<Diagnostics> Diagnostics { get; set; }
        public IDbSet<UserActivity> UserActivities { get; set; } 

        public CreateDbContext()
            : base(ConnectionStringName)
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
			modelBuilder.CheckForNull("modelBuilder");

            modelBuilder.Configurations.Add(new HistoryMapping());
            modelBuilder.Configurations.Add(new OptionsMapping());
            modelBuilder.Configurations.Add(new RoleMapping());
            modelBuilder.Configurations.Add(new ScriptMapping());
            modelBuilder.Configurations.Add(new SectionMapping());
            modelBuilder.Configurations.Add(new UserMapping());
            modelBuilder.Configurations.Add(new DiagnosticsMapping());
            modelBuilder.Configurations.Add(new UserActivityMapping());

            base.OnModelCreating(modelBuilder);
        } 
    }
}
