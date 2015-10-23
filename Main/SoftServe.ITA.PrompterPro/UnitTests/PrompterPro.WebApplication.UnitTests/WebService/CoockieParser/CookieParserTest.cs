using System;
using System.Web.Security;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Common.Exceptions;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser.Impl;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.WebService.CoockieParser
{
    [TestFixture]
    public class CoockieParserTest
    {
        [Test]
        public void CoockieParser_Test()
        {
            //Arange
            const string coockieData = "1,TestRole";

            var parser = new CookieParser();

            var indentity = new FormsIdentity(
                new FormsAuthenticationTicket(
                1,
                "TestLogin",
                new DateTime(1,1,1),
                new DateTime(1,1,1),
                false,
                coockieData));

            var badIdentity = new FormsIdentity(
                new FormsAuthenticationTicket(
                1,
                "Test",
                new DateTime(1, 1, 1),
                new DateTime(1, 1, 1),
                false,
                "someBadCoockieData")); 

            //Act
            var actualId = parser.GetUserId(indentity);
            var actualRoleName = parser.GetUserRoleName(indentity);
            var actualLogin = parser.GetUserLogin(indentity);

            //Assert
            Assert.Throws<ArgumentNullException>(() =>
                parser.GetUserId(null));
            Assert.Throws<ArgumentNullException>(() =>
                parser.GetUserRoleName(null));

            Assert.That(actualId == 1);
            Assert.That(actualRoleName == "TestRole");
            Assert.That(actualLogin == "TestLogin");

            Assert.Throws<CookieParserException>(() =>
                parser.GetUserId(badIdentity));
            Assert.Throws<CookieParserException>(() =>
                parser.GetUserRoleName(badIdentity));
        }
    }
}
