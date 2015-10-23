using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Common;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl
{
    public class UserMapper : IUserMapper
    {
        private readonly IRoleMapper _roleMapper;

        public UserMapper(IRoleMapper roleMapper)
        {
            roleMapper.CheckForNull("roleMapper");
            _roleMapper = roleMapper;
        }

        public TransferUser Map(User user)
        {
            if (user == null)
            {
                return null;
            }
            return new TransferUser
            {
                UserId = user.UserId,
                Login = user.Login,
                PrompterStatus = user.PrompterStatus,
                Password = user.Password,
                Disabled = user.Disabled,
                
                RoleId = user.RoleId,

                Role = _roleMapper.Map(user.Role),

				EntityState = EntityState.Unchanged
            };
        }
        public TransferUser MapLogin(User user)
        {
            if (user == null)
            {
                return null;
            }
            return new TransferUser
            {
                UserId = user.UserId,
                Login = user.Login,
                Password = user.Password,

                Role = _roleMapper.Map(user.Role),
            };
        }

        public User Map(TransferUser transferUser)
        {
            if (transferUser == null)
            {
                return null;
            }
            return new User
            {
                UserId = transferUser.UserId,
                Login = transferUser.Login,
                PrompterStatus = transferUser.PrompterStatus,
                Password = transferUser.Password,
                Disabled = transferUser.Disabled,
                RoleId = transferUser.RoleId,
                EntityState = transferUser.EntityState,
                //Role = _roleMapper.Map(transferUser.Role)
            };
        }
    }
}