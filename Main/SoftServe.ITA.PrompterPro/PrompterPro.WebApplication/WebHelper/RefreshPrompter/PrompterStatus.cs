using System;
using SoftServe.ITA.PrompterPro.Common;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Hubs;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.RefreshPrompter
{
    public interface IPrompterStatus
    {
       // void ChangeStatus(int id, string ststus);
        void OnPrompterStatusChange();
        void OffPrompterStatusChange();
        void OnChangeHandler(object sender, EventArgs e);
    }

    public class PrompterStatus : IPrompterStatus
    {
        private static IUserService _userService;
        private readonly IEvents _events;

        public PrompterStatus(IUserService userService, IEvents events)
        {
            _userService = userService;
            _events = events;
        }

        public static void ChangeStatus(int id, string status)
        {
            _userService.ChangePrompterStatus(id, status);
        }

        public void OnPrompterStatusChange()
        {
            _events.OnPrompterChange += OnChangeHandler;
        }
        public void OffPrompterStatusChange()
        {
            _events.OnPrompterChange -= OnChangeHandler;
        }
        public void OnChangeHandler(object sender, EventArgs e)
        {
            RefreshPrompterHub.Refresh();            
        }

    }
}