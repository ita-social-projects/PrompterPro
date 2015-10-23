using System.Collections.Generic;
using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebApi;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.WebApi
{
    [TestFixture]
    public class UserActivityControllerTest
    {
        [Test]
        public void Get_Test()
        {
            //Arange
            var stubService = new Mock<IUserActivityService>();
            var dummyMapper = new Mock<IUserActivityMapper>();

            var logs = new List<UserActivity>
            {
                new UserActivity(),
                new UserActivity(),
                new UserActivity()
            };

            stubService.Setup(s => s.FetchLogPage(It.IsAny<int>()))
                .Returns(logs);

            var controller = new UserActivityController(stubService.Object,
                dummyMapper.Object);
            //Act
            var actual = controller.Get(1);

            //Assert
            stubService.Verify(s => s.FetchLogPage(It.IsAny<int>()),
                Times.Once);
            dummyMapper.Verify(s => s.Map(It.IsAny<UserActivity>()),
                Times.Exactly(3));

            Assert.That(actual.Count == 3);
        }

        [Test]
        public void Delete_Test()
        {
            //Arange
            var stubService = new Mock<IUserActivityService>();
            var dummyMapper = new Mock<IUserActivityMapper>();

            var controller = new UserActivityController(stubService.Object,
                dummyMapper.Object);

            //Act
            controller.Delete();

            //Assert
            stubService.Verify(s=>s.ClearUserActivityHistory(),
                Times.Once);
        }
    }
}
