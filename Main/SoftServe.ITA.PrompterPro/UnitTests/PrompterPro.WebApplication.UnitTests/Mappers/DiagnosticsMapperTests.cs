using System;
using System.Data.Entity;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.Mappers
{
    [TestFixture]
    public class DiagnosticsMapperTests
    {
        [Test]
        public void Map_NullDiagnostics_ReturnsNull_Test()
        {
            //Arrange
            IDiagnosticsMapper mapper = new DiagnosticsMapper();

            //Assert
            Assert.That(mapper.Map(diagnostics: null), Is.Null);
        }

        [Test]
        public void Map_DomainToTransfer_Test()
        {
            //Arrange
            IDiagnosticsMapper mapper = new DiagnosticsMapper();
            var domainDiagnostics = new Diagnostics
            {
                DiagnosticsId = 1,
                Date = new DateTime(2015, 1, 1),
                EntityState = EntityState.Unchanged,
                ExceptionName = "NewException",
                Message = "Error",
                UserId = 1
            };
            var expectedTransferDiagnostics = new TransferDiagnosticsLikeness
            {
                DiagnosticsId = 1,
                Date = new DateTime(2015, 1, 1),
                EntityState = EntityState.Unchanged,
                ExceptionName = "NewException",
                Message = "Error",
                UserId = 1
            };

            //Act
            var actualTransferDiagnostics = mapper.Map(domainDiagnostics);

            //Assert
            Assert.That(actualTransferDiagnostics, Is.EqualTo(expectedTransferDiagnostics));
        }

        [Test]
        public void Map_TransferToDomain_Test()
        {
            //Arrange
            IDiagnosticsMapper mapper = new DiagnosticsMapper();
            var transferDiagnostics = new TransferDiagnostics
            {
                DiagnosticsId = 1,
                Date = new DateTime(2015, 1, 1),
                EntityState = EntityState.Unchanged,
                ExceptionName = "NewException",
                Message = "Error",
                UserId = 1
            };
            var expectedDomainDiagnostics = new DomainDiagnosticsLikeness
            {
                DiagnosticsId = 1,
                Date = new DateTime(2015, 1, 1),
                EntityState = EntityState.Unchanged,
                ExceptionName = "NewException",
                Message = "Error",
                UserId = 1
            };

            //Act
            var actualDomainDiagnostics = mapper.Map(transferDiagnostics);

            //Assert
            Assert.That(actualDomainDiagnostics, Is.EqualTo(expectedDomainDiagnostics));
        }
    }

    public sealed class TransferDiagnosticsLikeness : TransferDiagnostics
    {
        public override int GetHashCode()
        {
            throw new NotImplementedException();
        }

        public override bool Equals(object obj)
        {
            var diagnostics = (obj) as TransferDiagnostics;
            return diagnostics != null &&
                   diagnostics.DiagnosticsId == DiagnosticsId &&
                   diagnostics.UserId == UserId &&
                   diagnostics.ExceptionName == ExceptionName &&
                   diagnostics.Message == Message &&
                   diagnostics.Date == Date &&
                   diagnostics.EntityState == EntityState;
        }
    }
    public sealed class DomainDiagnosticsLikeness : Diagnostics
    {
        public override int GetHashCode()
        {
            throw new NotImplementedException();
        }

        public override bool Equals(object obj)
        {
            var diagnostics = (obj) as Diagnostics;
            return diagnostics != null &&
                   diagnostics.DiagnosticsId == DiagnosticsId &&
                   diagnostics.UserId == UserId &&
                   diagnostics.ExceptionName == ExceptionName &&
                   diagnostics.Message == Message &&
                   diagnostics.Date == Date &&
                   diagnostics.EntityState == EntityState;
        }
    }
}
