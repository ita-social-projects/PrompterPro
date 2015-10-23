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
    public class DiagnosticsServiceTests
    {
        [Test]
        public void FetchLastDiagnostics_Test()
        {
            //Arrange
            var diagnosticsContextFactory = new Mock<IPrompterDiagnosticsDbContextFactory>();
            var diagnosticsContext = new Mock<IPrompterDiagnosticsDbContext>();
            var diagnosticsDbSet = new Mock<IDbSet<Diagnostics>>();

            var diagnostics = new List<Diagnostics>
            {
                new Diagnostics
                {
                    DiagnosticsId = 1,
                    Date = DateTime.Now
                },
                new Diagnostics
                {
                    DiagnosticsId = 2,
                    Date = DateTime.Now
                }
            }.AsQueryable();

            diagnosticsContextFactory.Setup(t => t.Create())
                .Returns(diagnosticsContext.Object);

            diagnosticsDbSet.Setup(t => t.Provider)
                .Returns(diagnostics.Provider);
            diagnosticsDbSet.Setup(t => t.Expression)
                .Returns(diagnostics.Expression);
            diagnosticsDbSet.Setup(t => t.GetEnumerator())
                .Returns(diagnostics.GetEnumerator());

            diagnosticsContext.Setup(t => t.Diagnostics)
                .Returns(diagnosticsDbSet.Object);
            
            var diagnosticsService = new DiagnosticsService(diagnosticsContextFactory.Object);
            
            //Act
            var actual = diagnosticsService.FetchLastDiagnostics();

            //Assert
            Assert.That(actual, Is.Not.Null);
            Assert.That(actual.Count, Is.EqualTo(2));
            diagnosticsContext.Verify(t => t.Diagnostics, Times.Once());
        }

        [Test]
        public void FetchDiagnosticsFromDate_Test()
        {
            //Arrange
            var diagnosticsContextFactory = new Mock<IPrompterDiagnosticsDbContextFactory>();
            var diagnosticsContext = new Mock<IPrompterDiagnosticsDbContext>();
            var diagnosticsDbSet = new Mock<IDbSet<Diagnostics>>();

            var diagnostics = new List<Diagnostics>
            {
                new Diagnostics
                {
                    DiagnosticsId = 1,
                    Date = new DateTime(1,1,1)
                },
                new Diagnostics
                {
                    DiagnosticsId = 2,
                    Date = new DateTime(1,1,2)
                }
            }.AsQueryable();

            diagnosticsContextFactory.Setup(t => t.Create())
                .Returns(diagnosticsContext.Object);

            diagnosticsDbSet.Setup(t => t.Provider)
                .Returns(diagnostics.Provider);
            diagnosticsDbSet.Setup(t => t.Expression)
                .Returns(diagnostics.Expression);
            diagnosticsDbSet.Setup(t => t.GetEnumerator())
                .Returns(diagnostics.GetEnumerator());

            diagnosticsContext.Setup(t => t.Diagnostics)
                .Returns(diagnosticsDbSet.Object);

            var diagnosticsService = new DiagnosticsService(diagnosticsContextFactory.Object);

            //Act
            var actual = diagnosticsService.FetchDiagnosticsFromDate(new DateTime(1,1,2));

            //Assert
            Assert.That(actual, Is.Not.Null);
            Assert.That(actual.Count, Is.EqualTo(1));
            diagnosticsContext.Verify(t => t.Diagnostics, Times.Once());
        }

        [Test]
        public async void SaveDiagnosticAsync_Test()
        {
            //Arrange
            var diagnosticContextFactory = new Mock<IPrompterDiagnosticsDbContextFactory>();
            var diagnosticContext = new Mock<IPrompterDiagnosticsDbContext>();

            diagnosticContext.Setup(t => t.Diagnostics.Add(It.IsAny<Diagnostics>()));

            diagnosticContextFactory.Setup(t => t.Create())
                .Returns(diagnosticContext.Object);
            
            var diagnosticsService = new DiagnosticsService(diagnosticContextFactory.Object);

            //Act
            await diagnosticsService.SaveDiagnosticAsync(new Diagnostics());

            //Assert

            diagnosticContextFactory.Verify(t => t.Create(), Times.Once);
            diagnosticContext.Verify(t => t.SaveChangesAsync(), Times.Once);
            Assert.Throws<ArgumentNullException>(
                async () => await diagnosticsService.SaveDiagnosticAsync(null));

        }
    }
}
