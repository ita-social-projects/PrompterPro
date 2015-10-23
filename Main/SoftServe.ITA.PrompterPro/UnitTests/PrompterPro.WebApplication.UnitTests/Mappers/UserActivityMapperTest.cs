using System;
using System.Data.Entity;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.Mappers
{
    [TestFixture]
    public class UserActivityMapperTest
    {
        [Test]
        public void Map_Test()
        {
            //Arange
            var transferLog = new TransferUserActivity
            {
                Date = new DateTime(1, 1, 1),
                Description = "test",
                EntityState = EntityState.Unchanged,
                LogId = 1,
                UserId = 1,
                UserName = "test"
            };

            var log = new UserActivity
            {
                Date = new DateTime(1, 1, 1),
                Description = "test",
                EntityState = EntityState.Unchanged,
                LogId = 1,
                UserId = 1,
                UserName = "test"
            };

            var comperableDomainLog = new ComperableDomainLog()
            {
                Date = new DateTime(1, 1, 1),
                Description = "test",
                EntityState = EntityState.Unchanged,
                LogId = 1,
                UserId = 1,
                UserName = "test"
            };

            var comperableTransferLog = new ComperableTransferLog()
            {
                Date = new DateTime(1, 1, 1),
                Description = "test",
                EntityState = EntityState.Unchanged,
                LogId = 1,
                UserId = 1,
                UserName = "test"
            };

            var mapper = new UserActivityMapper();
            //Act
            var actualTransfer = mapper.Map(log);
            var actualDomain = mapper.Map(transferLog);

            //Assert
            Assert.That(actualDomain,
                Is.EqualTo(comperableDomainLog));
            Assert.That(actualTransfer,
                Is.EqualTo(comperableTransferLog));
        }

        private sealed class ComperableDomainLog : UserActivity 
        {
            public override int GetHashCode()
            {
                throw new NotImplementedException();
            }

            public override bool Equals(object obj)
            {
                var log = obj as UserActivity;
                if (log == null)
                {
                    return false;
                }
                return Description == log.Description
                       && Date == log.Date
                       && UserId == log.UserId
                       && UserName == log.UserName
                       && EntityState == log.EntityState
                       && LogId == log.LogId;
            }
        }

        private sealed class ComperableTransferLog : TransferUserActivity
        {
            public override int GetHashCode()
            {
                throw new NotImplementedException();
            }

            public override bool Equals(object obj)
            {
                var log = obj as TransferUserActivity;
                if (log == null)
                {
                    return false;
                }
                return Description == log.Description
                       && Date == log.Date
                       && UserId == log.UserId
                       && UserName == log.UserName
                       && EntityState == log.EntityState
                       && LogId == log.LogId;
            }
        }
    }
}
