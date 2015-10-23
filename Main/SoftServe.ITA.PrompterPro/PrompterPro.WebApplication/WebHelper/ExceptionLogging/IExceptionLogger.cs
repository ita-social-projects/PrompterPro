using System;
using System.Web;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.ExceptionLogging
{
    public interface IExceptionLogger
    {
        void LogError(Exception exception, HttpContext context);
    }
}