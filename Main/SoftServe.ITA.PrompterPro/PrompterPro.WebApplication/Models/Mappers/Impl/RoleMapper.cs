using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl
{
    public class RoleMapper : IRoleMapper
    {
        public TransferRole Map(Role role)
        {
            if (role == null)
            {
                return null;
            }
            return new TransferRole
            {
                RoleId = role.RoleId,
                Name = role.Name,

				EntityState = EntityState.Unchanged
            };
        }

        public Role Map(TransferRole transferRole)
        {
            if (transferRole == null)
            {
                return null;
            }
            return new Role
            {
                RoleId = transferRole.RoleId,
                Name = transferRole.Name,
                EntityState = transferRole.EntityState
            };
        }
    }
}