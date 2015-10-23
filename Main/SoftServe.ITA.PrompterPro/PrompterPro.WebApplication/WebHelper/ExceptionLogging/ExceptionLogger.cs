using System;
using System.Data.Entity;
using System.Web;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.ExceptionLogging
{
    public class ExceptionLogger : IExceptionLogger
    {
        private readonly IDiagnosticsService _diagnosticsService;
        private readonly ICookieParser _cookieParser;

        public ExceptionLogger(IDiagnosticsService diagnosticsService, ICookieParser cookieParser)
        {
            _diagnosticsService = diagnosticsService;
            _cookieParser = cookieParser;
        }

        public void LogError(Exception exception, HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if (exception == null)
            {
                throw new ArgumentNullException("exception");
            }

            var identity = (FormsIdentity)context.User.Identity;
            var userId = _cookieParser.GetUserId(identity);
            Diagnostics diagnostic = new Diagnostics
            {
                UserId = userId,
                ExceptionName = exception.GetType().ToString(),
                Message = exception.Message,
                Date = DateTime.Now,
                EntityState = EntityState.Added
            };
            _diagnosticsService.SaveDiagnosticAsync(diagnostic);
        }
    }
}