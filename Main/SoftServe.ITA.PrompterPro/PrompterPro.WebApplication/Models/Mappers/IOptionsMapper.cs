using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers
{
    public interface IOptionsMapper
    {
        TransferOptions Map(Options options);
        Options Map(TransferOptions transferOptions);
    }
}
