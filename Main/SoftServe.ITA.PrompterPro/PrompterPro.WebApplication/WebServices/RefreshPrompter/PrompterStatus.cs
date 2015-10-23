using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SoftServe.ITA.PrompterPro.Domain.Services;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebServices.RefreshPrompter
{
    public interface IPrompterStatus
    {
        void ChangeStatus(int id, string ststus);
    }

    public class PrompterStatus : IPrompterStatus
    {
        private readonly IUserService _userService;
        public PrompterStatus(IUserService userService)
        {
            _userService = userService;
            ;
        }

        public void ChangeStatus(int id, string ststus)
        {
            _userService.CgangePromterStatus(id, ststus);
        }

    }
}