using System.Web.Mvc;
using System.Web.Routing;
using SoftServe.ITA.PrompterPro.Common;

namespace SoftServe.ITA.PrompterPro.WebApplication
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.CheckForNull("routes");

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "LogOut",
                url: "Login/Logout",
                defaults: new {controller = "Login", action = "LogOut"}
                );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new {controller = "Login", action = "Index", id = UrlParameter.Optional}
                );
        }
    }
}
