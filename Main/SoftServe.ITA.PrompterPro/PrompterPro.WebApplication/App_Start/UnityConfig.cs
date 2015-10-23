using System.Web.Http;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using SoftServe.ITA.PrompterPro.Common;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.Domain.Services.Impl;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.ExceptionLogging;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser.Impl;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.RefreshPrompter;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityDescriptionSetter;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityStatusChanger;
using SoftServe.ITA.PrompterPro.WebApplication.Security;
using Unity.Mvc5;

namespace SoftServe.ITA.PrompterPro.WebApplication
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            
            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            // e.g. container.RegisterType<ITestService, TestService>();


            container.RegisterType<IRoleMapper, RoleMapper>(new ContainerControlledLifetimeManager());
            container.RegisterType<IUserMapper, UserMapper>(new ContainerControlledLifetimeManager());
            container.RegisterType<ISectionMapper, SectionMapper>(new ContainerControlledLifetimeManager());
            container.RegisterType<IOptionsMapper, OptionsMapper>(new ContainerControlledLifetimeManager());
            container.RegisterType<IScriptMapper, ScriptMapper>(new ContainerControlledLifetimeManager());
            container.RegisterType<IDiagnosticsMapper, DiagnosticsMapper>(new ContainerControlledLifetimeManager());

            container.RegisterType<IPrompterDbContextFactory, PrompterDbContextFactory>();

            container.RegisterType<IUserService, UserService>();
            container.RegisterType<IScriptService, ScriptService>();
            container.RegisterType<ILoginService, LoginService>();

            container.RegisterType<IPrompterDiagnosticsDbContextFactory, PrompterDiagnosticsDbContextFactory>();
            container.RegisterType<IDiagnosticsService, DiagnosticsService>();

	        container.RegisterType<IPresentationParser, PresentationParser>();
            container.RegisterType<IWebSecurity, WebSecurity>();

            container.RegisterType<IUserActivityService, UserActivityService>();
            container.RegisterType<IUserActivityMapper, UserActivityMapper>();
            container.RegisterType<ICookieParser, CookieParser>(new ContainerControlledLifetimeManager());
            container.RegisterType<IDefaultUserActivityDescription, DefaultUserActivityDescription>();
            container.RegisterType<IUserActivityLoggingState, UserActivityLoggingState>();

            container.RegisterType<IExceptionLogger, ExceptionLogger>();

            
            container.RegisterType<IPrompterStatus, PrompterStatus>();
            container.RegisterType<IPrompterStatus, PrompterStatus>(new ContainerControlledLifetimeManager());
            container.RegisterType<IEvents, Events>(new ContainerControlledLifetimeManager());

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
            
            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);
        }
    }
}