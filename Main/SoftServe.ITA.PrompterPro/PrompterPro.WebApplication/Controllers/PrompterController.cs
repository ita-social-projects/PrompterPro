using System.Web.Mvc;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;

namespace SoftServe.ITA.PrompterPro.WebApplication.Controllers
{
    [Authorize(Roles = "Prompter")]
    [MvcLogActionFilter]
    public class PrompterController : Controller
    {
        // GET: Prompter
        public ActionResult Index()
        {
            return View();
        }
    }
}