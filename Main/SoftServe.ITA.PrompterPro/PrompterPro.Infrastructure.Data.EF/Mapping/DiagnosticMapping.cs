using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class DiagnosticsMapping : BaseMapping<Diagnostics>
    {
        public DiagnosticsMapping()
        {
            ToTable("Diagnostics");
            HasKey(t => t.DiagnosticsId);
            Property(t => t.UserId).IsRequired();
            Property(t => t.Date).IsRequired();

            Property(t => t.Message).IsRequired();
            Property(t => t.ExceptionName).IsRequired();
        }
    }
}
