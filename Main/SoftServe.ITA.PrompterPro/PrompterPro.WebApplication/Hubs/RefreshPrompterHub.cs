using Microsoft.AspNet.SignalR;

namespace SoftServe.ITA.PrompterPro.WebApplication.Hubs
{
    public class RefreshPrompterHub : Hub
    {
        public static void Refresh()
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<RefreshPrompterHub>();
            context.Clients.All.DisplayStatus();
        }

    }
}