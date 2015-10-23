using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers
{
    public interface IUserActivityMapper
    {
        TransferUserActivity Map(UserActivity log);
        UserActivity Map(TransferUserActivity log);
    }
}
