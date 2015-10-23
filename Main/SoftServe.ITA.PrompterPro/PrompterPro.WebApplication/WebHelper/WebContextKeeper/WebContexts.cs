using System;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.WebContextKeeper
{
    public class WebContexts : IWebContexts
    {
        public HttpContext CurrentHttpContext { get; private set; }
        public ResultExecutedContext ResultExecutedContext { get; private set; }
        public HttpActionExecutedContext HttpActionExecutedContext { get; private set; }

        private WebContexts(HttpContext httpContext)
        {
            CurrentHttpContext = new HttpContext(httpContext.Request, httpContext.Response)
            {
                User = httpContext.User
            };
        }

        public WebContexts(HttpContext httpContext,
            ResultExecutedContext filterContext)
            : this(httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException("httpContext");
            }

            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

            ResultExecutedContext = filterContext;
        }

        public WebContexts(HttpContext httpContext,
            HttpActionExecutedContext filterContext)
            : this(httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException("httpContext");
            }

            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

            HttpActionExecutedContext = filterContext;
        }
    }
}