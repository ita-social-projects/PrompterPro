using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.WebContextKeeper;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityDescriptionSetter
{
    public interface IDefaultUserActivityDescription
    {
        string GetDefaultDescription(WebContexts webContext);
    }
}
