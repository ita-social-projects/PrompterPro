using System;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Security;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.Security
{
    [TestFixture]
    public class SecurityTests
    {
        [Test]
        public static void Authorize_Test()
        {
            //Arange
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
            const int days = 7;
            var expirationDate = DateTime.Now.AddDays(days).ToLocalTime();
            var security = new WebSecurity();

            //Act
            var cookie = security.Authorize(user);
            var emptyCookie = security.Authorize(null);
            
            //Assert
           
            Assert.That(cookie, Is.Not.Null);
            Assert.That(cookie.Name == ".ASPXAUTH");
            Assert.That(TrimToSeconds(cookie.Expires) == TrimToSeconds(expirationDate));
            Assert.That(emptyCookie, Is.Null);
        }
        public static DateTime TrimToSeconds(DateTime dt)
        {
            return new DateTime(dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, 0, 0);
        }
    }
}
