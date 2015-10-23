using System.Web.Mvc;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;
using SoftServe.ITA.PrompterPro.WebApplication.Security;

namespace SoftServe.ITA.PrompterPro.WebApplication.Controllers
{
    public class LoginController : Controller
    {
        private readonly IWebSecurity _security;
        private readonly ILoginService _service;

        public LoginController(IWebSecurity security, ILoginService service)
        {
            _security = security;
            _service = service;
        }


        //
        // GET: /Login/
        [HttpGet]
        public ActionResult Index()
        {
            if (User.IsInRole("Admin"))
            {
                return RedirectToAction("Index", "Admin");
            }

            if (User.IsInRole("Operator"))
            {
                return RedirectToAction("Index", "Operator");
            }

            if (User.IsInRole("Prompter"))
            {
                return RedirectToAction("Index", "Prompter");
            }

            return View();
        }


        public JsonResult UserLogin(User user)
        {
            if (user == null)
            {
                return null;
            }
            var validUser = _service.GetUser(user);
            if (validUser == null)
            {
                return null;
            }
            var cookie = _security.Authorize(validUser);
            if (cookie == null)
            {
                return null;
            }
            Response.Cookies.Clear();
            Response.Cookies.Add(cookie);
            user.Password = string.Empty;
            user.RoleId = validUser.RoleId;
            user.Role = new Role
            {
                RoleId = validUser.Role.RoleId,
                Name = validUser.Role.Name
            };
            return new JsonResult
            {
                Data = user,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [MvcLogActionFilter]
        public ActionResult LogOut()
        {

            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Login");
        }

    }
}