using System;
using System.Web;
using System.Web.Mvc;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.ExceptionLogging
{
    public class MvcExceptionHandlingFilter : IExceptionFilter
    {
        private readonly IExceptionLogger _exceptionLogger;

        public MvcExceptionHandlingFilter(IExceptionLogger exceptionLogger)
        {
            _exceptionLogger = exceptionLogger;
        }

        public void OnException(ExceptionContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }
            HttpContext context = HttpContext.Current;
            _exceptionLogger.LogError(filterContext.Exception, context);
        }
    }
}