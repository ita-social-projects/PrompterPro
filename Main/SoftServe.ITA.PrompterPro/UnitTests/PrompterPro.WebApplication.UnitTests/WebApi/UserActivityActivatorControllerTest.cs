using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.WebApplication.WebApi;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityStatusChanger;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.WebApi
{
    [TestFixture]
    public class UserActivityActivatorControllerTest
    {
        [Test]
        public void Get_Test()
        {
            //Arange
            var stubUserActivityLoggingState = new Mock<IUserActivityLoggingState>();

            stubUserActivityLoggingState.Setup(w => w.IsUserActivityActivated)
                .Returns(true);

            var controller = new UserActivityActivatorController(stubUserActivityLoggingState.Object);

            //Act
            var actual = controller.Get();

            //Assert
            Assert.That(actual);
        }

        [Test]
        public void Post_Test()
        {
            //Arange
            var stubUserActivityLoggingState = new Mock<IUserActivityLoggingState>();

            stubUserActivityLoggingState.Setup(w => w.IsUserActivityActivated)
                .Returns(true);

            var controller = new UserActivityActivatorController(stubUserActivityLoggingState.Object);

            //Act
            var actual = controller.Post(true);

            //Assert
            Assert.That(actual);
        }
    }
}
