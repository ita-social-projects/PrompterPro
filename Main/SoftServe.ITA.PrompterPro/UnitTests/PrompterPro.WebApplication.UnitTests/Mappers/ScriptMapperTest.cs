using System;
using System.Data.Entity;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser.Impl;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.Mappers
{
    [TestFixture]
    internal class ScriptMapperTest
    {
        [Test]
        public void Map_NullScript_ReturnsNull_Test()
        {
            //Arange
            var dummyRoleMapper = new RoleMapper();
            var dummyUserMapper = new UserMapper(dummyRoleMapper);
            var dummyOptionMapper = new OptionsMapper();
            var dummySectionMapper = new SectionMapper();

            IScriptMapper mapper = new ScriptMapper(dummyUserMapper, dummyOptionMapper,
                dummySectionMapper, new CookieParser());

            //Assert
            Assert.That(mapper.Map(script: null), Is.Null);
        }

        [Test]
        public void Map_toTransfer_Test()
        {
            //Arange
            var dummyRoleMapper = new RoleMapper();
            var dummyUserMapper = new UserMapper(dummyRoleMapper);
            var dummyOptionMapper = new OptionsMapper();
            var dummySectionMapper = new SectionMapper();

            IScriptMapper mapper = new ScriptMapper(dummyUserMapper, dummyOptionMapper,
                dummySectionMapper, new CookieParser());

            var script = new Script
            {
                EntityState = EntityState.Unchanged,
                OperatorId = 99,
                ScriptId = 99,
                Title = "test",
                CreatedDate = new DateTime(1, 1, 1),
                LastEditedDate = new DateTime(1, 1, 1),
                OptionsId = 99,
                PrompterId = 99,
                Options = null,
                Operator = null,
                Prompter = null
            };

            var expected = new ComparableTransferScript
            {
                EntityState = EntityState.Unchanged,
                OperatorId = 99,
                ScriptId = 99,
                Title = "test",
                CreatedDate = new DateTime(1, 1, 1),
                LastEditedDate = new DateTime(1, 1, 1),
                OptionsId = 99,
                PrompterId = 99,
                Options = null,
                Operator = null,
                Prompter = null
            };

            //Act
            var actual = mapper.Map(script);

            //Assert
            Assert.That(actual, Is.EqualTo(expected));
            Assert.That(actual.Options, Is.Null);
            Assert.That(actual.Operator, Is.Null);
            Assert.That(actual.Prompter, Is.Null);
        }

        [Test]
        public void Map_toDomain_Test()
        {
            //Arange
            var dummyRoleMapper = new RoleMapper();
            var dummyUserMapper = new UserMapper(dummyRoleMapper);
            var dummyOptionMapper = new OptionsMapper();
            var dummySectionMapper = new SectionMapper();

            IScriptMapper mapper = new ScriptMapper(dummyUserMapper, dummyOptionMapper,
                dummySectionMapper, new CookieParser());

            var script = new TransferScript
            {
                EntityState = EntityState.Unchanged,
                OperatorId = 99,
                ScriptId = 99,
                Title = "test",
                CreatedDate = new DateTime(1, 1, 1),
                LastEditedDate = new DateTime(1, 1, 1),
                OptionsId = 99,
                PrompterId = 99,
                Options = null,
                Operator = null,
                Prompter = null
            };

            var expected = new ComparableScript
            {
                EntityState = EntityState.Unchanged,
                OperatorId = 99,
                ScriptId = 99,
                Title = "test",
                CreatedDate = new DateTime(1, 1, 1),
                LastEditedDate = new DateTime(1, 1, 1),
                OptionsId = 99,
                PrompterId = 99,
                Options = null,
                Operator = null,
                Prompter = null
            };

            //Act
            var actual = mapper.Map(script);

            //Assert
            Assert.That(actual, Is.EqualTo(expected));
            Assert.That(actual.Options, Is.Null);
            Assert.That(actual.Operator, Is.Null);
            Assert.That(actual.Prompter, Is.Null);
        }

        [Test]
        public void Map_DependencyMap_Test()
        {
            // Arrange
            var dummyRoleMapper = new RoleMapper();
            var dummyUserMapper = new UserMapper(dummyRoleMapper);
            var dummyOptionMapper = new OptionsMapper();
            var dummySectionMapper = new SectionMapper();

            IScriptMapper mapper = new ScriptMapper(dummyUserMapper, dummyOptionMapper,
                dummySectionMapper, new CookieParser());

            var script = new Script
            {
                Options = new Options
                {
                    AnnouncerName = "test"
                },
                Operator = new User
                {
                    UserId = 1
                },
                Prompter = new User
                {
                    UserId = 1
                }
            };

            var expected = new ComparableTransferScript
            {
                Options = new TransferOptions
                {
                    AnnouncerName = "test"
                },
                Operator = new TransferUser
                {
                    UserId = 1
                },
                Prompter = new TransferUser
                {
                    UserId = 1
                }
            };

            //Act:
            var actual = mapper.Map(script);

            //Assert
            Assert.That(actual.Options.AnnouncerName,
                Is.EqualTo(expected.Options.AnnouncerName));

            Assert.That(actual.Operator.UserId,
                Is.EqualTo(expected.Operator.UserId));

            Assert.That(actual.Prompter.UserId,
                Is.EqualTo(expected.Prompter.UserId));
        }

        private sealed class ComparableTransferScript : TransferScript
        {
            public override int GetHashCode()
            {
                throw new NotImplementedException();
            }

            public override bool Equals(object obj)
            {
                var income = obj as TransferScript;

                if (income == null)
                    return false;
                return EntityState == income.EntityState &&
                       OperatorId == income.OperatorId &&
                       ScriptId == income.ScriptId &&
                       Title == income.Title &&
                       CreatedDate == income.CreatedDate &&
                       LastEditedDate == income.LastEditedDate &&
                       OptionsId == income.OptionsId &&
                       PrompterId == income.PrompterId;

            }
        }

        private sealed class ComparableScript : Script
        {
            public override int GetHashCode()
            {
                throw new NotImplementedException();
            }

            public override bool Equals(object obj)
            {
                var income = obj as Script;

                if (income == null)
                    return false;
                return EntityState == income.EntityState &&
                       OperatorId == income.OperatorId &&
                       ScriptId == income.ScriptId &&
                       Title == income.Title &&
                       CreatedDate == income.CreatedDate &&
                       LastEditedDate == income.LastEditedDate &&
                       OptionsId == income.OptionsId &&
                       PrompterId == income.PrompterId;
            }
        }
    }
}
