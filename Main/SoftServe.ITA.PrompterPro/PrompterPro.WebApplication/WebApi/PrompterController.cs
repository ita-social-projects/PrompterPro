using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebApi
{
    [Authorize(Roles = "Operator")]
    [WebApiLogActionFilter]
    public class PrompterController : ApiController
    {
        private readonly IUserService _userService;
        private readonly IUserMapper _userMapper;

        public PrompterController(IUserService userService,
            IUserMapper userMapper)
        {
            _userService = userService;
            _userMapper = userMapper;
        }
        
        public IList<TransferUser> Get()
        {
            return _userService.FetchAllPrompters()
                .Select(prompter => _userMapper.Map(prompter))
                .ToList();
        }
    }
}
