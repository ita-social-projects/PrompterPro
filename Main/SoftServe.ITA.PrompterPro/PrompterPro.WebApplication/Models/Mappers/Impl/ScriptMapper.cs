using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Common;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl
{
    public class ScriptMapper : IScriptMapper
    {
        private readonly IUserMapper _userMapper;
        private readonly IOptionsMapper _optionsMapper;
        private readonly ISectionMapper _sectionMapper;
	    private readonly ICookieParser _cookieParser;

        public ScriptMapper(IUserMapper userMapper, IOptionsMapper optionsMapper,
			ISectionMapper sectionMapper, ICookieParser cookieParser)
        {
            userMapper.CheckForNull("userMapper");
            optionsMapper.CheckForNull("optionsMapper");
            sectionMapper.CheckForNull("sectionMapper");

            _userMapper = userMapper;
            _optionsMapper = optionsMapper;
            _sectionMapper = sectionMapper;
	        _cookieParser = cookieParser;
        }

        public TransferScript Map(Script script)
        {
            if (script == null)
            {
                return null;
            }

            TransferScript transferScript = new TransferScript
            {
                ScriptId = script.ScriptId,
                Title = script.Title,
                CreatedDate = script.CreatedDate,
                Description = script.Description,
                LastEditedDate = script.LastEditedDate,

                OperatorId = script.OperatorId,
                PrompterId = script.PrompterId,
                OptionsId = script.OptionsId,

                Operator = _userMapper.Map(script.Operator),
                Prompter = _userMapper.Map(script.Prompter),
               
                Options = _optionsMapper.Map(script.Options),
                
                EntityState = EntityState.Unchanged
            };

            if (script.Sections != null)
			{
				transferScript.Sections =
					script.Sections
					.Select(section => _sectionMapper.Map(section))
					.ToList();
			}

            return transferScript;
        }

        public Script Map(TransferScript transferScript)
        {
            if (transferScript == null)
            {
                return null;
            }

            Script script = new Script
            {
                ScriptId = transferScript.ScriptId,
                Title = transferScript.Title,
                CreatedDate = transferScript.CreatedDate,
                Description = transferScript.Description,
                LastEditedDate = transferScript.LastEditedDate,

                OperatorId = transferScript.OperatorId,
                PrompterId = transferScript.PrompterId,
                OptionsId = transferScript.OptionsId,

                Options = _optionsMapper.Map(transferScript.Options),
                EntityState = transferScript.EntityState
            };

	        if (script.EntityState == EntityState.Added)
			{
				var identity = (FormsIdentity)HttpContext.Current.User.Identity;
				script.OperatorId = _cookieParser.GetUserId(identity);
	        }

            if (transferScript.Sections != null)
            {
                script.Sections = 
					transferScript.Sections
					.Select(section => _sectionMapper.Map(section))
                    .ToList();
            }

            return script;
        }
    }
}