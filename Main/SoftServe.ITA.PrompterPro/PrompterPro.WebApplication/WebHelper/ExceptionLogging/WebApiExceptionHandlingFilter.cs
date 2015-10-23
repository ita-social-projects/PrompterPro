using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.ExceptionLogging
{
    public class WebApiExceptionHandlingFilter : IExceptionFilter
    {
        private readonly IExceptionLogger _exceptionLogger;

        public WebApiExceptionHandlingFilter(IExceptionLogger exceptionLogger)
        {
            _exceptionLogger = exceptionLogger;
        }
        
        public async Task ExecuteExceptionFilterAsync(HttpActionExecutedContext actionExecutedContext, CancellationToken cancellationToken)
        {
            HttpContext context = HttpContext.Current;
            await Task.Factory.StartNew(() =>
            {
                _exceptionLogger.LogError(actionExecutedContext.Exception, context);
                
            }, cancellationToken);
        }

        public bool AllowMultiple
        {
            get { return true; }
        }
    }
}