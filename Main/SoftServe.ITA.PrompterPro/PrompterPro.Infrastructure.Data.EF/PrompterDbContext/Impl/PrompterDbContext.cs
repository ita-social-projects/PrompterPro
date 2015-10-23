using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext.Impl
{
    public class PrompterDbContext : BaseDbContext, IPrompterDbContext
    {
        public IDbSet<History> Histories { get; set; }
        public IDbSet<Options> Options { get; set; }
        public IDbSet<Role> Roles { get; set; }
        public IDbSet<Script> Scripts { get; set; }
        public IDbSet<Section> Sections { get; set; }
        public IDbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            if (modelBuilder != null)
            {
                modelBuilder.Configurations.Add(new HistoryMapping());
                modelBuilder.Configurations.Add(new OptionsMapping());
                modelBuilder.Configurations.Add(new RoleMapping());
                modelBuilder.Configurations.Add(new ScriptMapping());
                modelBuilder.Configurations.Add(new SectionMapping());
                modelBuilder.Configurations.Add(new UserMapping());
            }

            base.OnModelCreating(modelBuilder);
        }        
    }
}
