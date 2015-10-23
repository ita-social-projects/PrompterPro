using System.Web.Http;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityStatusChanger;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebApi
{
    [Authorize(Roles = "Admin")]
    [WebApiLogActionFilter]
    public class UserActivityActivatorController : ApiController
    {
        private readonly IUserActivityLoggingState _userActivityLoggingState;

        public UserActivityActivatorController(IUserActivityLoggingState userActivityLoggingState)
        {
            _userActivityLoggingState = userActivityLoggingState;
        }

        public bool Get()
        {
            return _userActivityLoggingState.IsUserActivityActivated;
        }

        public bool Post(bool isUserActivityActivated)
        {
            _userActivityLoggingState
                .IsUserActivityActivated = isUserActivityActivated;

            return _userActivityLoggingState.IsUserActivityActivated;
        }
    }
}