using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers
{
    public interface IScriptMapper
    {
        TransferScript Map(Script script);
        Script Map(TransferScript transferScript);
    }
}
