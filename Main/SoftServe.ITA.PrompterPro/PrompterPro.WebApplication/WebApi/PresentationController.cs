using System.IO;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebApi
{
	[Authorize(Roles = "Operator")]
    [WebApiLogActionFilter]
    public class PresentationController : ApiController
	{
		private readonly IPresentationParser _presentationParser;
		private readonly IScriptService _scriptService;
		private readonly IScriptMapper _scriptMapper;
		private readonly ICookieParser _cookieParser;

		public PresentationController(IPresentationParser presentationParser,
			IScriptService scriptService, IScriptMapper scriptMapper, ICookieParser cookieParser)
		{
			_presentationParser = presentationParser;
			_scriptService = scriptService;
			_scriptMapper = scriptMapper;
			_cookieParser = cookieParser;
		}

        public TransferScript Post()
		{
            var fileStream = GetFileStream();

            Script script =
                _presentationParser.Parse(fileStream);
			
			var identity = 
				(FormsIdentity)HttpContext.Current.User.Identity;
			script.OperatorId = _cookieParser.GetUserId(identity);
		    script.Title = GetFileName();

            _scriptService.SaveScript(script);

            return _scriptMapper.Map(script);
		}

	    private static Stream GetFileStream()
        {
            var httpRequest = HttpContext.Current.Request;
	        
			if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
                return postedFile.InputStream;
			}

	        return null;
        }

        private static string GetFileName()
        {
            var httpRequest = HttpContext.Current.Request;

            string fileName = null;
	        
			if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
                fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
			}

            return fileName;
        }

    }
}
