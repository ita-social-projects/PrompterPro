using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Domain.Services
{
    public interface ILoginService
    {
        User GetUser(User user);
    }
}
