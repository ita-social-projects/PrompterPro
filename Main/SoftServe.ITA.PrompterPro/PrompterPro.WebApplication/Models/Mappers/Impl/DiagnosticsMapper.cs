using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl
{
    public class DiagnosticsMapper : IDiagnosticsMapper
    {
        public TransferDiagnostics Map(Diagnostics diagnostics)
        {
            if (diagnostics == null)
            {
                return null;
            }
            return new TransferDiagnostics
            {
                DiagnosticsId = diagnostics.DiagnosticsId,
                UserId = diagnostics.UserId,
                ExceptionName = diagnostics.ExceptionName,
                Message = diagnostics.Message,
                Date = diagnostics.Date,

				EntityState = EntityState.Unchanged
            };
        }

        public Diagnostics Map(TransferDiagnostics transferDiagnostics)
        {
            if (transferDiagnostics == null)
            {
                return null;
            }
            return new Diagnostics
            {
                DiagnosticsId = transferDiagnostics.DiagnosticsId,
                UserId = transferDiagnostics.UserId,
                ExceptionName = transferDiagnostics.ExceptionName,
                Message = transferDiagnostics.Message,
                Date = transferDiagnostics.Date,
                EntityState = transferDiagnostics.EntityState
            };
        }
    }
}