using System.Collections.Generic;
using SoftServe.ITA.PrompterPro.Domain.Models;
using System;
using System.Threading.Tasks;

namespace SoftServe.ITA.PrompterPro.Domain.Services
{
    public interface IDiagnosticsService
    {
        IList<Diagnostics> FetchLastDiagnostics();
        IList<Diagnostics> FetchDiagnosticsFromDate(DateTime fromDate);
        Task SaveDiagnosticAsync(Diagnostics diagnostic);
    }
}
