using System.Web.Mvc;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;

namespace SoftServe.ITA.PrompterPro.WebApplication.Controllers
{
    [Authorize(Roles = "Operator")]
    [MvcLogActionFilter]
    public class OperatorController : Controller
    {
        // GET: Operator
        public ActionResult Index()
        {
            return View();
        }
    }
}