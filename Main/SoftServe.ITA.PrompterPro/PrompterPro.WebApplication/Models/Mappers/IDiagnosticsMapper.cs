using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers
{
    public interface IDiagnosticsMapper
    {
        TransferDiagnostics Map(Diagnostics diagnostics);
        Diagnostics Map(TransferDiagnostics transferDiagnostics);
    }
}
