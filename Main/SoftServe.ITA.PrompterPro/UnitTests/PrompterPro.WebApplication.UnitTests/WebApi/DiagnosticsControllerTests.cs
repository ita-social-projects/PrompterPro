using System;
using System.Collections.Generic;
using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebApi;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.WebApi
{
    [TestFixture]
    public class DiagnosticsControllerTests
    {
        [Test]
        public void Get_Test()
        {
            //Arrange
            var diagnosticsServiceMock = new Mock<IDiagnosticsService>();
            var cookieParserMock = new Mock<ICookieParser>();
            var diagnostics = new List<Diagnostics>
            {
                new Diagnostics
                {
                    DiagnosticsId = 1
                }
            };

            diagnosticsServiceMock.Setup(t => t.FetchLastDiagnostics())
                                  .Returns(diagnostics);

            var diagnosticsMapperStub = new Mock<IDiagnosticsMapper>();

            var diagnosticsController = 
                new DiagnosticsController(diagnosticsServiceMock.Object,
                                          diagnosticsMapperStub.Object,
                                          cookieParserMock.Object);
            
            //Act
            IList<TransferDiagnostics> actualTransferDiagnostics = diagnosticsController.Get();

            //Assert
            Assert.That(actualTransferDiagnostics, Is.Not.Null);
            diagnosticsServiceMock.Verify(t => t.FetchLastDiagnostics(),Times.Once());
        }

        [Test]
        public void Get_FromDate_Test()
        {
            //Arrange
            var diagnosticsServiceMock = new Mock<IDiagnosticsService>();
            var cookieParserMock = new Mock<ICookieParser>();
            var diagnostics = new List<Diagnostics>
            {
                new Diagnostics
                {
                    DiagnosticsId = 1
                }
            };

            diagnosticsServiceMock.Setup(t => t.FetchDiagnosticsFromDate(new DateTime(1,1,1)))
                                  .Returns(diagnostics);

            var diagnosticsMapperStub = new Mock<IDiagnosticsMapper>();

            var diagnosticsController =
                new DiagnosticsController(diagnosticsServiceMock.Object,
                                          diagnosticsMapperStub.Object,
                                          cookieParserMock.Object);
            
            //Act
            IList<TransferDiagnostics> actualTransferDiagnostics = diagnosticsController.Get(new DateTime(1,1,1));

            //Assert
            Assert.That(actualTransferDiagnostics, Is.Not.Null);
            Assert.That(actualTransferDiagnostics.Count, Is.EqualTo(1));
            diagnosticsServiceMock.Verify(t => t.FetchDiagnosticsFromDate(new DateTime(1,1,1)), Times.Once());
        }
    }
}
