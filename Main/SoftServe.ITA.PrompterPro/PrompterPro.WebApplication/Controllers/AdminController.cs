using System.Web.Mvc;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;

namespace SoftServe.ITA.PrompterPro.WebApplication.Controllers
{
    [Authorize(Roles = "Admin")]
    [MvcLogActionFilter]
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Diagnostics()
        {
            return View();
        }
        
        public ActionResult Users()
        {
            return View();
        }

        public ActionResult UserActivity()
        {
            return View();
        }
    }
}