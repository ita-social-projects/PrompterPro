using System;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.Mappers
{
    [TestFixture]
    public class RoleMapperTests
    {
        [Test]
        public void Map_NullRole_ReturnsNull_Test()
        {
            IRoleMapper mapper = new RoleMapper();
            Assert.That(mapper.Map(role: null), Is.Null);
        }

        [Test]
        public void Map_Test()
        {
            IRoleMapper mapper = new RoleMapper();
            var role = new Role
            {
                RoleId = 1,
                Name = "TestRole"
            };

            var expected = new TransferRoleLikeness
            {
                RoleId = 1,
                Name = "TestRole"
            };

            TransferRole actual = mapper.Map(role);

            Assert.That(actual, Is.EqualTo(expected));
        }

    }

    public sealed class TransferRoleLikeness : TransferRole
    {

        public override int GetHashCode()
        {
            throw new NotImplementedException();
        }

        public override bool Equals(object obj)
        {
            var role = (obj) as TransferRole;
            return role != null && role.Name == this.Name && role.RoleId == this.RoleId;
        }
    }
}
