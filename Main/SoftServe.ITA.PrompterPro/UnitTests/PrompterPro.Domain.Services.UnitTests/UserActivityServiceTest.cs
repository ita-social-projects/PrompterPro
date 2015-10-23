using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services.Impl;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;

namespace SoftServe.ITA.PrompterPro.Domain.Services.UnitTests
{
    [TestFixture]
    public class UserActivityServiceTest
    {
        [Test]
        public void FetchLogPage_Test()
        {
            //Arange
            const int pageCount = 50;

            var stubLogFactory = new Mock<IPrompterDiagnosticsDbContextFactory>();
            var stubLogContext = new Mock<IPrompterDiagnosticsDbContext>();

            stubLogFactory.Setup(l => l.Create())
                .Returns(stubLogContext.Object);

            var logs = new List<UserActivity>(pageCount * 2);

            for (int i = 0; i < pageCount * 2; i++)
            {
                logs.Add(new UserActivity());
            }

            var contextLogs = logs.AsQueryable();

            stubLogContext.Setup(c => c.UserActivities.GetEnumerator())
                .Returns(contextLogs.GetEnumerator());
            stubLogContext.Setup(c => c.UserActivities.Provider)
                .Returns(contextLogs.Provider);
            stubLogContext.Setup(c => c.UserActivities.Expression)
                .Returns(contextLogs.Expression);

            var service = new UserActivityService(stubLogFactory.Object);

            //Act
            var actual = service.FetchLogPage(1);

            //Assert
            stubLogFactory.Verify(f => f.Create(),
                Times.Once);
            stubLogContext.Verify(c => c.UserActivities,
                Times.Once);

            Assert.That(actual.Count == pageCount);

            Assert.That(service.FetchLogPage(2)
                .Count == pageCount);

            Assert.That(service.FetchLogPage(3)
                .Count == 0);
        }

        [Test]
        public void FetchAllLogs_Test()
        {
            //Arange
            var stubDiagnosticFactory = new Mock<IPrompterDiagnosticsDbContextFactory>();
            var stubDiagnosticContext = new Mock<IPrompterDiagnosticsDbContext>();

            var logs = new List<UserActivity>
            {
                new UserActivity(),
                new UserActivity()
            }.AsQueryable();

            stubDiagnosticFactory.Setup(f => f.Create())
                .Returns(stubDiagnosticContext.Object);

            stubDiagnosticContext.Setup(c => c.UserActivities.GetEnumerator())
                .Returns(logs.GetEnumerator());
            stubDiagnosticContext.Setup(c => c.UserActivities.Provider)
                .Returns(logs.Provider);
            stubDiagnosticContext.Setup(c => c.UserActivities.Expression)
                .Returns(logs.Expression);

            var service = new UserActivityService(stubDiagnosticFactory.Object);

            //Act
            var actual = service.FetchAllLogs();

            //Assert
            Assert.That(actual.Count == 2);
            Assert.That(actual[0].EntityState == EntityState.Unchanged);
            Assert.That(actual[1].EntityState == EntityState.Unchanged);

            stubDiagnosticFactory.Verify(f => f.Create(), Times.Once());

            stubDiagnosticContext.Verify(c => c.UserActivities, Times.Once);
        }

        [Test]
        public async void SaveActivity_Test()
        {
            //Arange
            var stubDiagnosticFactory = new Mock<IPrompterDiagnosticsDbContextFactory>();
            var dummyDiagnosticContext = new Mock<IPrompterDiagnosticsDbContext>();

            stubDiagnosticFactory.Setup(d => d.Create())
                .Returns(dummyDiagnosticContext.Object);

            dummyDiagnosticContext.Setup(d => d.UserActivities
                .Add(It.IsAny<UserActivity>()));

            var service = new UserActivityService(stubDiagnosticFactory.Object);

            //Act
            await service.SaveActivityAsync(new UserActivity());

            //Assert
            stubDiagnosticFactory.Verify(f => f.Create(), Times.Once);
            dummyDiagnosticContext.Verify(c => c.SaveChangesAsync(), Times.Once);

            Assert.Throws<ArgumentNullException>(
                async () => await service.SaveActivityAsync(null));
        }
    }
}
