using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Controllers;
using SoftServe.ITA.PrompterPro.WebApplication.Security;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.Controllers
{
    [TestFixture]
    public class LoginControllerTests
    {
        [Test]
        public void UserLogin_Test()
        {
            //Arange
            var stubSecurity = new Mock<IWebSecurity>();
            var stubLoginService = new Mock<ILoginService>();
            var expectedUser = new User
            {
                Login = "Admin"
            };
            var user = new User
            {
                UserId = 1,
                Disabled = false,
                Login = "Admin",
                Password = "Admin",
                RoleId = 1,
                Role = new Role
                {
                    Name = "Admin"
                }
            };
            var httpCookie = new HttpCookie("Admin", "Admin");

            stubLoginService.Setup(s => s.GetUser
                (It.IsAny<User>()))
                .Returns(user);
           
            stubSecurity.Setup(s => s.Authorize
                (It.IsAny<User>()))
                .Returns(httpCookie);

            var context = new Mock<HttpContextBase>(MockBehavior.Strict);
            context.SetupGet(x => x.Response.Cookies).Returns(new HttpCookieCollection());

            var rc = new RequestContext(context.Object, new RouteData());

            var controller = new LoginController
               (stubSecurity.Object, stubLoginService.Object);
            controller.ControllerContext = new ControllerContext(rc, controller);

            //Act

            var actual = controller.UserLogin(user);
            var actualUser = (User)actual.Data;
            //Assert
            Assert.That(actualUser.Login == expectedUser.Login);
        }
        [Test]
        public void UserLoginWithNull_Test()
        {
            //Arange
            var stubSecurity = new Mock<IWebSecurity>();
            var stubLoginService = new Mock<ILoginService>();
            var user = new User
            {
                UserId = 1,
                Disabled = false,
                Login = "Admin",
                Password = "Admin",
                RoleId = 1,
                Role = new Role
                {
                    Name = "Admin"
                }
            };
            var httpCookie = new HttpCookie("Admin", "Admin");

            stubLoginService.Setup(s => s.GetUser
                (It.IsAny<User>()))
                .Returns(user);

            stubSecurity.Setup(s => s.Authorize
                (It.IsAny<User>()))
                .Returns(httpCookie);

            var context = new Mock<HttpContextBase>(MockBehavior.Strict);
            context.SetupGet(x => x.Response.Cookies).Returns(new HttpCookieCollection());

            var rc = new RequestContext(context.Object, new RouteData());

            var controller = new LoginController
               (stubSecurity.Object, stubLoginService.Object);
            controller.ControllerContext = new ControllerContext(rc, controller);

            //Act
            var actual2 = controller.UserLogin(null);
            //Assert
            Assert.That(actual2, Is.Null);
        }
    }
}
