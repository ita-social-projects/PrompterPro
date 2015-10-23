using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(SoftServe.ITA.PrompterPro.WebApplication.Hubs.OwinStartup))]

namespace SoftServe.ITA.PrompterPro.WebApplication.Hubs
{
    public class OwinStartup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
