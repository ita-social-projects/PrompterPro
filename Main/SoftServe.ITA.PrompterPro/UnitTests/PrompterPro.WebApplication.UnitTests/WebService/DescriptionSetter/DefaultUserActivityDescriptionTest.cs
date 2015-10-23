using System;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Mvc;
using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Controllers;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.RefreshPrompter;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityDescriptionSetter;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.WebContextKeeper;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.WebService.DescriptionSetter
{
    [TestFixture]
    class DefaultUserActivityDescriptionTest
    {
        [Test]
        public void GetDefaultDesctiption_ForMvc_Test()
        {
            //Arange
            var resultExecutedContext = new ResultExecutedContext
            {
                Controller = new PrompterController()
            };

            resultExecutedContext.Controller
                .ControllerContext = new ActionExecutedContext
            {
                Controller = new PrompterController()
            };

            HttpContext.Current = new HttpContext(
                new HttpRequest(null,
                    "http://testUrl/test",
                    null),
                new HttpResponse(null));

            var webContexts = new WebContexts(HttpContext.Current, resultExecutedContext);

            var defaultUserActivityDesctiption = new DefaultUserActivityDescription();

            //Act
            var actual = defaultUserActivityDesctiption
                .GetDefaultDescription(webContexts);
            
            //Assert
            Assert.That(actual != null);
            Assert.That(actual.Contains("/test"));
            Assert.That(actual.Contains("PrompterController"));
            Assert.That(actual.Contains("Mvc"));
            Assert.That(actual.Contains("GET"));

            Assert.Throws<ArgumentNullException>(() =>
            {
                defaultUserActivityDesctiption
                    .GetDefaultDescription(null);
            });
        }

        [Test]
        public void GetDefaultDesctiption_ForWebApi_Test()
        {
            //Arange
            var dummyUserService = new Mock<IUserService>();
            var dummyUserMapper = new Mock<IUserMapper>();
            

            var actionExecutedContext = new HttpActionExecutedContext
            {
                ActionContext = new HttpActionContext()
            };

            actionExecutedContext.ActionContext
                .ControllerContext = new HttpControllerContext
                {
                    Controller = new WebApplication.WebApi.PrompterController(
                        dummyUserService.Object,
                        dummyUserMapper.Object)
                };

            HttpContext.Current = new HttpContext(
                new HttpRequest(null,
                    "http://testUrl/test",
                    null),
                new HttpResponse(null));

            var webContexts = new WebContexts(HttpContext.Current, actionExecutedContext);

            var defaultUserActivityDesctiption = new DefaultUserActivityDescription();

            //Act
            var actual = defaultUserActivityDesctiption
                .GetDefaultDescription(webContexts);

            //Assert
            Assert.That(actual != null);
            Assert.That(actual.Contains("/test"));
            Assert.That(actual.Contains("PrompterController"));
            Assert.That(actual.Contains("WebApi"));
            Assert.That(actual.Contains("GET"));

            Assert.Throws<ArgumentNullException>(() =>
            {
                defaultUserActivityDesctiption
                    .GetDefaultDescription(null);
            });
        }

    }
}
