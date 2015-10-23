using System.Collections.Generic;
using System.Threading.Tasks;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Domain.Services
{
    public interface IUserActivityService
    {
        IList<UserActivity> FetchAllLogs();
        IList<UserActivity> FetchLogPage(int page);
        Task SaveActivityAsync(UserActivity log);
        void ClearUserActivityHistory();
    }
}