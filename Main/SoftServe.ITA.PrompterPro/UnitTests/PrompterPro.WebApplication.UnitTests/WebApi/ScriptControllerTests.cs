using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebApi;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser.Impl;

namespace SoftServe.ITA.PrompterPro.WebApplication.UnitTests.WebApi
{
    [TestFixture]
    public class ScriptControllerTests
    {
        [Test]
        public void Get_ById_Test()
        {
            //Arange
            var stubScriptService = new Mock<IScriptService>();
            var stubMapper = new Mock<IScriptMapper>();

            var script = new Script
            {
                ScriptId = 1
            };

            var transferScript = new TransferScript
            {
                ScriptId = 1
            };

            stubScriptService.Setup(ss => ss.FetchScriptById(1))
                .Returns(script);
            stubMapper.Setup(m => m.Map(script))
                .Returns(transferScript);

            var controller = new ScriptController(stubScriptService.Object,
                stubMapper.Object, new CookieParser());

            //Act
            var actual = controller.Get(1);

            //Assert
            Assert.That(actual.ScriptId == script.ScriptId);

            stubMapper.Verify(m => m.Map(script),
                Times.Once);

            stubScriptService.Verify(ss => ss.FetchScriptById(1),
                Times.Once);
        }
    }
}
