using System;
using System.Collections.Generic;
using System.Linq;
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
    [Authorize(Roles = "Admin, Operator, Prompter")]
    [WebApiLogActionFilter]
    public class DiagnosticsController : ApiController
    {
        private readonly IDiagnosticsService _diagnosticsService;
        private readonly IDiagnosticsMapper _diagnosticsMapper;
        private readonly ICookieParser _cookieParser;

        public DiagnosticsController(IDiagnosticsService diagnosticsService,
            IDiagnosticsMapper diagnosticsMapper, ICookieParser cookieParser)
        {
            _diagnosticsService = diagnosticsService;
            _diagnosticsMapper = diagnosticsMapper;
            _cookieParser = cookieParser;
        }

        public IList<TransferDiagnostics> Get()
        {
            return _diagnosticsService.FetchLastDiagnostics()
                                      .Select(diagnostics => _diagnosticsMapper.Map(diagnostics))
                                      .ToList();
        }

        public IList<TransferDiagnostics> Get(DateTime fromDate)
        {
            return _diagnosticsService.FetchDiagnosticsFromDate(fromDate)
                                      .Select(diagnostics => _diagnosticsMapper.Map(diagnostics))
                                      .ToList();
        }

        public void Post(TransferDiagnostics transferDiagnostic)
        {
            if (transferDiagnostic == null)
            {
                throw new ArgumentNullException("transferDiagnostic");
            }

            var identity = (FormsIdentity)HttpContext.Current.User.Identity;
            var userId = _cookieParser.GetUserId(identity);

            Diagnostics diagnostic = _diagnosticsMapper.Map(transferDiagnostic);
            diagnostic.UserId = userId;
            _diagnosticsService.SaveDiagnosticAsync(diagnostic);
        }
    }
}
