using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext.Impl;

namespace SoftServe.ITA.PrompterPro.Domain.Services.Impl
{
    public class PrompterDiagnosticsDbContextFactory : IPrompterDiagnosticsDbContextFactory
    {
        public IPrompterDiagnosticsDbContext Create()
        {
            return new PrompterDiagnosticsDbContext();
        }
    }
}
