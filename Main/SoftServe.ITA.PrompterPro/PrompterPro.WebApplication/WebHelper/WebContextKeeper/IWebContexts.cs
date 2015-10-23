using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.WebContextKeeper
{
    public interface IWebContexts
    {
        HttpContext CurrentHttpContext { get; }
        ResultExecutedContext ResultExecutedContext { get; }
        HttpActionExecutedContext HttpActionExecutedContext { get; }
    }
}
