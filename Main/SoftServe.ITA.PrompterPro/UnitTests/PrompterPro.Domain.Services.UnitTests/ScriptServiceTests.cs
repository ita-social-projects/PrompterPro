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
    public class ScriptServiceTests
    {
        /*[Test]
        public void Null_Test()
        {
            Assert.That(new ScriptService(dbContextFactory: null)
                ,Throws.Exception);
        }*/

        [Test]
        public void FetchAllScripts_Test()
        {
            //Arange
            var stubFactory = new Mock<IPrompterDbContextFactory>();
            var stubContext = new Mock<IPrompterDbContext>();
            var scriptDbSet = new Mock<IDbSet<Script>>();

            var script = new Script
            {
                ScriptId = 1,
                Title = "test",
                OptionsId = 1,
                Sections = new List<Section>
                {
                    new Section
                    {
                        Order = 2,
                    },
                    new Section
                    {
                        Order = 1,
                    }
                }
            };

            var fakeScripts = new List<Script>
            {
                script,
                new Script
                {
                    Sections = new List<Section>()
                }
            }.AsQueryable();

            stubFactory.Setup(s => s.Create())
                .Returns(stubContext.Object);

            scriptDbSet.Setup(s => s.Provider)
                .Returns(fakeScripts.Provider);
            scriptDbSet.Setup(s => s.Expression)
                .Returns(fakeScripts.Expression);
            scriptDbSet.Setup(s => s.GetEnumerator())
                .Returns(fakeScripts.GetEnumerator());

            stubContext.Setup(s => s.Scripts)
                .Returns(scriptDbSet.Object);

            var service = new ScriptService(stubFactory.Object);

            //Act
            var actual = service.FetchAllScripts();

            //Assert
            Assert.That(actual.Count, Is.EqualTo(2));
            Assert.That(actual.Contains(script));
            Assert.That(SectionsAreOrdered(actual[0]), Is.True);
            Assert.That(actual[0].Title == "test");
            stubContext.Verify(s => s.Scripts, Times.Once);
        }

        [Test]
        public void FetchScriptById_Test()
        {
            //Arange
            var stubFactory = new Mock<IPrompterDbContextFactory>();
            var stubContext = new Mock<IPrompterDbContext>();
            var scriptDbSet = new Mock<IDbSet<Script>>();

            var fakeScripts = new List<Script>
            {
                new Script
                {
                    ScriptId = 1,
                    Sections = new List<Section>
                    {
                        new Section
                        {
                            Order = 2
                        },
                        new Section
                        {
                            Order = 1
                        }
                    }
                },
                new Script
                {
                    ScriptId = 2
                }
            }.AsQueryable();

            stubFactory.Setup(s => s.Create())
                .Returns(stubContext.Object);

            scriptDbSet.Setup(s => s.Provider)
                .Returns(fakeScripts.Provider);
            scriptDbSet.Setup(s => s.Expression)
                .Returns(fakeScripts.Expression);
            scriptDbSet.Setup(s => s.GetEnumerator())
                .Returns(fakeScripts.GetEnumerator());

            stubContext.Setup(s => s.Scripts)
                .Returns(scriptDbSet.Object);

            var service = new ScriptService(stubFactory.Object);

            //Act
            var actual = service.FetchScriptById(1);
            var nullScript = service.FetchScriptById(15);

            //Assert
            Assert.That(nullScript, Is.Null);
            Assert.That(actual, Is.Not.Null);
            Assert.That(actual.ScriptId == 1);
            Assert.That(SectionsAreOrdered(actual), Is.True);
            stubContext.Verify(s => s.Scripts, Times.Exactly(2));
        }

        [Test]
        public void SaveScript_Test()
        {
            //Arrange
            var stubFactory = new Mock<IPrompterDbContextFactory>();
            var dummyContext = new Mock<IPrompterDbContext>();
            stubFactory.Setup(f => f.Create())
                .Returns(dummyContext.Object);
            var dummyScript = new Mock<Script>();

            //Act
            var service = new ScriptService(stubFactory.Object);
            service.SaveScript(dummyScript.Object);

            //Assert
            stubFactory.Verify(f => f.Create(), Times.Exactly(1));

            dummyContext.Verify(c=>c.Attach(dummyScript.Object)
                ,Times.Exactly(1));
            dummyContext.Verify(c => c.SaveChanges()
                , Times.Exactly(1));
        }

        [Test]
        public void SaveScripts_Test()
        {
            //Arrange
            var stubFactory = new Mock<IPrompterDbContextFactory>();
            var dummyContext = new Mock<IPrompterDbContext>();
            stubFactory.Setup(f => f.Create())
                .Returns(dummyContext.Object);

            var dummyScripts = new List<Script>
            {
                new Script(),
                new Script()
            };

            //Act
            var service = new ScriptService(stubFactory.Object);
            service.SaveScripts(dummyScripts);

            //Assert
            stubFactory.Verify(f => f.Create(), Times.Exactly(1));

            dummyContext.Verify(c => c.Attach(dummyScripts[0])
                , Times.Exactly(1));
            dummyContext.Verify(c => c.Attach(dummyScripts[1])
                , Times.Exactly(1));
            dummyContext.Verify(c => c.SaveChanges()
                , Times.Exactly(1));
        }

        private bool SectionsAreOrdered(Script script)
        {
            if (script == null || script.Sections == null)
            {
                return false;
            }
            int prev = 0;
            foreach (var section in script.Sections)
            {
                if (section.Order < prev)
                    return false;
                prev = section.Order;
            }
            return true;
        }
    }
}
