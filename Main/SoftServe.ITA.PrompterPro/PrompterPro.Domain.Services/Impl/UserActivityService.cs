using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;

namespace SoftServe.ITA.PrompterPro.Domain.Services.Impl
{
    public class UserActivityService : IUserActivityService
    {
        private const int PageSize = 50;
        private const string TableName = "[UserActivity]";
        private const string SqlCommandToDeleteAllRows = "TRUNCATE TABLE ";

        private readonly IPrompterDiagnosticsDbContextFactory _diagnosticFactory;
        private IPrompterDiagnosticsDbContext _diagnosticContext;

        public UserActivityService(IPrompterDiagnosticsDbContextFactory diagnosticFactory)
        {
            _diagnosticFactory = diagnosticFactory;
        }

        public IList<UserActivity> FetchLogPage(int page)
        {
            var previousPages = page <= 0
                ? 0
                : page - 1;

            using (_diagnosticContext = _diagnosticFactory.Create())
            {
                var result = (from log
                    in _diagnosticContext.UserActivities
                              select log)
                    .OrderByDescending(l => l.Date)
                    .Skip(PageSize * previousPages)
                    .Take(PageSize)
                    .ToList();

                return result;
            }
        }

        public IList<UserActivity> FetchAllLogs()
        {
            using (_diagnosticContext = _diagnosticFactory.Create())
            {
                var result = (from log
                    in _diagnosticContext.UserActivities
                    select log)
                    .OrderByDescending(l => l.Date)
                    .ToList();

                return result;
            }
        }

        public async Task SaveActivityAsync(UserActivity log)
        {
            if (log == null)
            {
                throw new ArgumentNullException("log");
            }

            using (_diagnosticContext = _diagnosticFactory.Create())
            {
                _diagnosticContext.UserActivities
                    .Add(log);

                await _diagnosticContext.SaveChangesAsync();
            }
        }

        public void ClearUserActivityHistory()
        {
            using (_diagnosticContext = _diagnosticFactory.Create())
            {
                var adapter = (IObjectContextAdapter)_diagnosticContext;
                var objectContext = adapter.ObjectContext;

                objectContext.ExecuteStoreCommand(SqlCommandToDeleteAllRows + TableName);
            }
        }
    }
}
