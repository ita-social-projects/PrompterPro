using System;
using System.Web.Configuration;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityStatusChanger
{
    public class UserActivityLoggingState : IUserActivityLoggingState
    {
        private const string UserActivityLoggingKeyName = "UserActivityLogging";
        private const string PathToWebConfing = "~";
        private const bool DefaultStatusState = false;

        private static bool _isUserActivityLoggingActivated;
        private static bool _isStateParsed;

        public bool IsUserActivityActivated
        {
            get
            {
                return _isStateParsed
                    ? _isUserActivityLoggingActivated
                    : ParseActivityStatusFromWebConfing();
            }

            set
            {
                _isUserActivityLoggingActivated = value;
            }
        }

        private static bool ParseActivityStatusFromWebConfing()
        {
            var configuration = WebConfigurationManager.OpenWebConfiguration(PathToWebConfing);

            var value = configuration.AppSettings
                .Settings[UserActivityLoggingKeyName]
                .Value;
            _isStateParsed = true;

            if (value == null)
            {
                _isUserActivityLoggingActivated = DefaultStatusState;
            }

            try
            {
                _isUserActivityLoggingActivated = Convert.ToBoolean(value);
                
            }
            catch (FormatException)
            {
                _isUserActivityLoggingActivated = DefaultStatusState;
            }

            return _isUserActivityLoggingActivated;
        }
    }
}