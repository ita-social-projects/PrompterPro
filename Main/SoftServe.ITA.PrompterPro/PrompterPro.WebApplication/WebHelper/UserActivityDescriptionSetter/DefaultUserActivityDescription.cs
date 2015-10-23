using System;
using System.Text.RegularExpressions;
using System.Web.Http.Filters;
using System.Web.Mvc;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.WebContextKeeper;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityDescriptionSetter
{
    public class DefaultUserActivityDescription : IDefaultUserActivityDescription
    {
        private string _controllerName;
        private string _controllerType;

        private IWebContexts _webContexts;
        
        public string GetDefaultDescription(WebContexts webContext)
        {
            if (webContext == null)
            {
                throw new ArgumentNullException("webContext");
            }

            _webContexts = webContext;

            if (_webContexts.ResultExecutedContext != null)
            {
                _controllerName = GetMvcControllerName(_webContexts.ResultExecutedContext);
                _controllerType = "Mvc";
            }

            if (_webContexts.HttpActionExecutedContext != null)
            {
                _controllerName = GetWebApiControllerName(_webContexts.HttpActionExecutedContext);
                _controllerType = "WebApi";
            }

            return FormDefaultDescription();
        }

        private static string GetMvcControllerName(ResultExecutedContext filterContext)
        {
           return ParseControllerName(filterContext.Controller
                .ControllerContext
                .Controller
                .ToString());
        }

        private static string GetWebApiControllerName(HttpActionExecutedContext actionExecutedContext)
        {
            return ParseControllerName(actionExecutedContext.ActionContext
                    .ControllerContext
                    .Controller
                    .ToString());
        }

        private string FormDefaultDescription()
        {
            var methodName = _webContexts.CurrentHttpContext
                .Request
                .HttpMethod;
            var url = _webContexts.CurrentHttpContext
                .Request
                .Url
                .AbsolutePath;

            return String.Format("Url: {0} ({1} ({2}): {3})",
                url,
                _controllerName,
                _controllerType,
                methodName);
        }

        private static string ParseControllerName(string fullControllerName)
        {
            const string pattern = @"\w+$";

            var regex = new Regex(pattern);

            var matches = regex.Match(fullControllerName);

            return matches.Success
                ? matches.Value
                : "Controller";
        }
    }
}