using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext.Impl
{
    public class PrompterDiagnosticsDbContext : BaseDbContext, IPrompterDiagnosticsDbContext
    {
        public IDbSet<Diagnostics> Diagnostics { get; set; }
        public IDbSet<UserActivity> UserActivities { get; set; } 
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
            if (modelBuilder != null)
            {
                modelBuilder.Configurations.Add(new DiagnosticsMapping());
                modelBuilder.Configurations.Add(new UserActivityMapping());
            }

            base.OnModelCreating(modelBuilder);
        }
    }
}
