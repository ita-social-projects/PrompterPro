using System.Collections.Generic;
using System.Linq;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;
using System;
using System.Data.Entity;
using System.Threading.Tasks;

namespace SoftServe.ITA.PrompterPro.Domain.Services.Impl
{
    public class DiagnosticsService : IDiagnosticsService
    {
        private readonly IPrompterDiagnosticsDbContextFactory _diagnosticsDbContextFactory;

        public DiagnosticsService(IPrompterDiagnosticsDbContextFactory diagnosticsDbContextFactory)
        {
			_diagnosticsDbContextFactory = diagnosticsDbContextFactory;
        }

        public IList<Diagnostics> FetchLastDiagnostics()
        {
           using(IPrompterDiagnosticsDbContext context = _diagnosticsDbContextFactory.Create())
           {
               var delta = DateTime.Now.
                   Subtract(TimeSpan.FromDays(7));
               return context.Diagnostics
                   .Where(diagnostic => diagnostic.Date >= delta)
                   .ToList();
           }
        }

        public IList<Diagnostics> FetchDiagnosticsFromDate(DateTime fromDate)
        {
            using (IPrompterDiagnosticsDbContext context = _diagnosticsDbContextFactory.Create())
            {
                return context.Diagnostics
                    .Where(diagnostic => diagnostic.Date >= fromDate)
                    .ToList();
            }
        }

        public async Task SaveDiagnosticAsync(Diagnostics diagnostic)
        {
            if (diagnostic == null)
            {
                throw new ArgumentNullException("diagnostic");
            }
            using (var context = _diagnosticsDbContextFactory.Create())
            {
                context.Diagnostics.Add(new Diagnostics
                {
                    UserId = diagnostic.UserId,
                    ExceptionName = diagnostic.ExceptionName,
                    Message = diagnostic.Message,
                    Date = diagnostic.Date,
                    EntityState = EntityState.Added
                });
                await context.SaveChangesAsync();
            }
        }
    }
}
