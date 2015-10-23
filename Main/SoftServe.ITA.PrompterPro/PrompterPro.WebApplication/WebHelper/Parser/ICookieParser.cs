using System.Web.Security;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser
{
    public interface ICookieParser
    {
        int GetUserId(FormsIdentity identity);
        string GetUserRoleName(FormsIdentity identity);
        string GetUserLogin(FormsIdentity identity);
    }
}
