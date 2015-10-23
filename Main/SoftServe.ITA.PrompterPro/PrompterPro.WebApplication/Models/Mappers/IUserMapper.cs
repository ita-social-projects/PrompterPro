using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers
{
    public interface IUserMapper
    {
        TransferUser Map(User user);
        User Map(TransferUser transferUser);
    }
}
