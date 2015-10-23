using System;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using System.Web.Http.Filters;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.ExceptionLogging;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.RefreshPrompter;

namespace SoftServe.ITA.PrompterPro.WebApplication
{
    public class Global : HttpApplication
    {
        private IPrompterStatus _prompterStatus;
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            AreaRegistration.RegisterAllAreas();
            UnityConfig.RegisterComponents();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            _prompterStatus = DependencyResolver.Current.GetService<IPrompterStatus>();
            _prompterStatus.OnPrompterStatusChange();

            RegisterGlobalHttpFilters(GlobalConfiguration.Configuration.Filters);
            RegisterGlobalFilters(GlobalFilters.Filters);
        }

        public static void RegisterGlobalHttpFilters(HttpFilterCollection filters)
        {
            filters.Add(new WebApiExceptionHandlingFilter(
                DependencyResolver.Current.GetService<IExceptionLogger>())); 
        }

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(DependencyResolver.Current.GetService<MvcExceptionHandlingFilter>());
        }

        //void Application_End(object sender, EventArgs e)
        //{
        //    _prompterStatus.OffPrompterStatusChange();

        //}

        public void Application_AuthenticateRequest(Object source, EventArgs e)
        {
            AuthCheck();
        }
        private static void AuthCheck()
        {
            if (HttpContext.Current.User == null)
            {
                return;
            }
            if (HttpContext.Current.User.Identity.AuthenticationType != "Forms")
            {
                return;
            }
            GetRole();
        }
        private static void GetRole()
        {
            var fid = (FormsIdentity)HttpContext.Current.User.Identity;
            var cookieParser = DependencyResolver.Current.GetService<ICookieParser>();
            string[] roles = { cookieParser.GetUserRoleName(fid) };
            HttpContext.Current.User = new GenericPrincipal(fid, roles);
        }
    }
}