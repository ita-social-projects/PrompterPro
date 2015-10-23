using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers
{
    public interface IRoleMapper
    {
        TransferRole Map(Role role);
        Role Map(TransferRole transferRole);
    }
}
