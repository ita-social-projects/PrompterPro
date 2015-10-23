using System;
using System.Data.Entity;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityStatusChanger;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityDescriptionSetter;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.WebContextKeeper;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = false)]
    public sealed class MvcLogActionFilterAttribute : ActionFilterAttribute
    {
        private readonly IUserActivityService _logService;
        private readonly ICookieParser _coockieParser;
        private readonly IDefaultUserActivityDescription _descriptionGetter;
        private readonly IUserActivityLoggingState _userActivityLoggingState;

        private string _desctiption;

        public MvcLogActionFilterAttribute()
            : this(null)
        {
        }

        public MvcLogActionFilterAttribute(string description)
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

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

            var contexts = new WebContexts(HttpContext.Current, filterContext);

            SaveLog(contexts);
        }

        private void SaveLog(WebContexts webContexts)
        {
            if (webContexts == null)
            {
                throw new ArgumentNullException("webContexts");
            }

            if (!_userActivityLoggingState.IsUserActivityActivated)
            {
                return;
            }

            if (_desctiption == null)
            {
                _desctiption = _descriptionGetter.GetDefaultDescription(webContexts);
            }

            var identity = (FormsIdentity)webContexts.CurrentHttpContext.User.Identity;
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