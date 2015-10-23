using System;
using System.Data.Entity;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityDescriptionSetter;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityStatusChanger;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.WebContextKeeper;
using ActionFilterAttribute = System.Web.Http.Filters.ActionFilterAttribute;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = false)]
    public sealed class WebApiLogActionFilterAttribute : ActionFilterAttribute
    {
        private readonly IUserActivityService _logService;
        private readonly ICookieParser _coockieParser;
        private readonly IDefaultUserActivityDescription _descriptionGetter;
        private readonly IUserActivityLoggingState _userActivityLoggingState;

        private string _desctiption;

        public WebApiLogActionFilterAttribute()
            : this(null)
        {
        }

        public WebApiLogActionFilterAttribute(string description)
        {
            _logService = DependencyResolver.Current
                .GetService<IUserActivityService>();
            _coockieParser = DependencyResolver.Current
                .GetService<ICookieParser>();
            _descriptionGetter = DependencyResolver.Current
                .GetService<IDefaultUserActivityDescription>();
            _userActivityLoggingState = DependencyResolver.Current
                .GetService<IUserActivityLoggingState>();

            _desctiption = description;
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext == null)
            {
                throw new ArgumentNullException("actionExecutedContext");
            }

            var contexts = new WebContexts(HttpContext.Current, actionExecutedContext);

            SaveLog(contexts);
        }

        private void SaveLog(WebContexts webContext)
        {
            if (webContext == null)
            {
                throw new ArgumentNullException("webContext");
            }

            if (!_userActivityLoggingState.IsUserActivityActivated)
            {
                return;
            }

            if (_desctiption == null)
            {
                _desctiption = _descriptionGetter.GetDefaultDescription(webContext);
            }

            var identity = (FormsIdentity)webContext.CurrentHttpContext.User.Identity;
            var userId = _coockieParser.GetUserId(identity);
            var userRoleName = _coockieParser.GetUserRoleName(identity);
            var userLogin = _coockieParser.GetUserLogin(identity);

            _logService.SaveActivityAsync(new UserActivity
            {
                Date = DateTime.Now,
                Description = _desctiption,
                EntityState = EntityState.Added,
                UserId = userId,
                UserName = userLogin,
                UserRoleName = userRoleName
            });
        }
    }
}