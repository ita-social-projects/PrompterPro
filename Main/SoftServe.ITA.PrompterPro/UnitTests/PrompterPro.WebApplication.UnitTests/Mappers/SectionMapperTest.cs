using System.Data.Entity;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.Mappers
{
    [TestFixture]
    class SectionMapperTest
    {
        [Test]
        public void Map_NullSection_ReturnsNull_Test()
        {
            //Arange
            ISectionMapper mapper = new SectionMapper();

            //Assert
            Assert.That(mapper.Map(section: null), Is.Null);
        }

        [Test]
        public void Map_toTransfer_Test()
        {
            //Arange
            var mapper = new SectionMapper();
            var section = new Section
            {
                Order = 1,
                ScriptId = 1,
                SectionId = 1,
                Text = "1",
                EntityState = EntityState.Unchanged
            };
            var expected = new ComparableTransferSection
            {
                Order = 1,
                ScriptId = 1,
                SectionId = 1,
                Text = "1",
                EntityState = EntityState.Unchanged
            };

            //Act
            TransferSection actual = mapper.Map(section);

            //Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void Map_toDomain_Test()
        {
            //Arange
            var mapper = new SectionMapper();

            var expected = new ComparableSection
            {
                Order = 1,
                ScriptId = 1,
                SectionId = 1,
                Text = "1",
                EntityState = EntityState.Unchanged
            };

            var section = new TransferSection
            {
                Order = 1,
                ScriptId = 1,
                SectionId = 1,
                Text = "1",
                EntityState = EntityState.Unchanged
            };

            //Act
            var actual = mapper.Map(section);

            //Assert
            Assert.AreEqual(expected, actual);
        }

        private class ComparableTransferSection : TransferSection
        {
            public override int GetHashCode()
            {
                throw new System.NotImplementedException();
            }

            public override bool Equals(object obj)
            {
                var income = obj as TransferSection;
                if (income == null)
                    return false;
                return Order == income.Order &&
                       ScriptId == income.ScriptId &&
                       SectionId == income.SectionId &&
                       Text == income.Text &&
                       EntityState == income.EntityState;
            }
        }

        private class ComparableSection : Section
        {
            public override int GetHashCode()
            {
                throw new System.NotImplementedException();
            }

            public override bool Equals(object obj)
            {
                var income = obj as Section;
                if (income != null)
                    return Order == income.Order &&
                           ScriptId == income.ScriptId &&
                           SectionId == income.SectionId &&
                           Text == income.Text &&
                           EntityState == income.EntityState;
                return false;
            }
        }
    }
}
