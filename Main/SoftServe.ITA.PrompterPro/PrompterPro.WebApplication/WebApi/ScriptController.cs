using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebApi
{
    [Authorize(Roles = "Operator, Prompter")]
    [WebApiLogActionFilter]
    public class ScriptController : ApiController
    {
        private readonly IScriptService _scriptService;
        private readonly IScriptMapper _scriptMapper;
	    private readonly ICookieParser _cookieParser;

        public ScriptController(IScriptService scriptService,
            IScriptMapper scriptMapper, ICookieParser cookieParser)
        {
            _scriptService = scriptService;
            _scriptMapper = scriptMapper;
	        _cookieParser = cookieParser;
        }

        public IList<TransferScript> Get()
        {
			var identity = (FormsIdentity)HttpContext.Current.User.Identity;
			var operatorId = _cookieParser.GetUserId(identity);

			return _scriptService.FetchScriptsByOperatorId(operatorId)
                .Select(script => _scriptMapper.Map(script))
                .ToList();
        }

        public TransferScript Get(int id)
        {
            return _scriptMapper.Map(_scriptService.FetchScriptById(id));
        }

        public IList<TransferScript> Post(IList<TransferScript> scripts)
        {
            if (scripts == null)
            {
                throw  new ArgumentNullException("scripts");
            }

            _scriptService.SaveScripts(
                scripts.Select((script => _scriptMapper.Map(script)))
                .ToList());

			var identity = (FormsIdentity)HttpContext.Current.User.Identity;
			var operatorId = _cookieParser.GetUserId(identity);
            return _scriptService.FetchScriptsByOperatorId(operatorId)
                .Select(script => _scriptMapper.Map(script))
                .ToList();
        }
    }
}