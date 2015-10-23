using System;
using System.Data.Entity;
using System.Threading.Tasks;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext
{
    public interface IPrompterDiagnosticsDbContext : IDisposable
    {
        IDbSet<Diagnostics> Diagnostics { get; }
        IDbSet<UserActivity> UserActivities { get; } 

        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
