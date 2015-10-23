using System;
using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext
{
    public abstract class BaseDbContext : DbContext
    {
        private const string ConnectionStringName = "name=DbConnectionString";
        private const string Prompter = "Prompter";

        protected BaseDbContext()
            : base(ConnectionStringName)
        {
            Database.SetInitializer<BaseDbContext>(null);
            Configuration.LazyLoadingEnabled = false;
        }


        public void Attach<T>(T baseModel) where T : class,IStateModel
        {
           Set<T>().Attach(baseModel);
            
            foreach (var entry in ChangeTracker.Entries<IStateModel>())
            {
                entry.State = entry.Entity.EntityState;
            }
            ApplyAuditInfo();
        }

        private void ApplyAuditInfo()
        {
            foreach (var entry in ChangeTracker.Entries<AuditModel>())
            {
                if (entry.Entity.EntityState == EntityState.Added)
                {
                    entry.Entity.CreatedDate = DateTime.Now;
                    entry.Entity.LastEditedDate = DateTime.Now;
                }
                if (entry.Entity.EntityState == EntityState.Modified)
                {
                    entry.Entity.LastEditedDate = DateTime.Now;
                }
            }
        }
    }
}
