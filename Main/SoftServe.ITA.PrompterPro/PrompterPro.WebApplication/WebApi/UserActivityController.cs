using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebApi
{
    [Authorize(Roles = "Admin")]
    public class UserActivityController : ApiController
    {
        private readonly IUserActivityService _service;
        private readonly IUserActivityMapper _mapper;

        public UserActivityController(IUserActivityService service,
            IUserActivityMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        public IList<TransferUserActivity> Get(int page)
        {
            return _service.FetchLogPage(page)
                .Select(log => _mapper.Map(log))
                .ToList();
        }

        public void Delete()
        {
            _service.ClearUserActivityHistory();
        }
    }
}