using System.Web;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Security
{
    public interface IWebSecurity
    {
        HttpCookie Authorize(User user);
    }
}