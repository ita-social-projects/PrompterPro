using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers
{
    public interface ISectionMapper
    {
        TransferSection Map(Section section);
        Section Map(TransferSection transferSection);
    }
}
