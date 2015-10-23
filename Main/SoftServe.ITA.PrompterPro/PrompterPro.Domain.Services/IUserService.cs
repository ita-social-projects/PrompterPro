using System.Collections.Generic;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Domain.Services
{
    public interface IUserService
    {
        IList<User> FetchUsers();
        User FetchUserByLogin(string login);
        void SaveUsers(IList<User> users);
        IList<User> FetchAllPrompters();
        void ChangePrompterStatus(int id, string status);
    }
}
