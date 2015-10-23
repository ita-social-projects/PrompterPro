using System;
using System.Data.Entity;
using System.Linq;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Domain.Services.Impl
{
    public class LoginService : ILoginService
    {
        private readonly IPrompterDbContextFactory _dbContextFactory;

        public LoginService(IPrompterDbContextFactory dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public User GetUser(User user)
        {
            const int minLength = 3;

            if (user == null)
            {
                return null;
            }

            if (user.Login.Length < minLength || user.Password.Length < minLength)
            {
                return null;
            }
            using (var context = _dbContextFactory.Create())
            {
                var getUser = context.Users
                    .Where(usr => usr.Login == user.Login.Trim()
                        && (!usr.Disabled)
                        && usr.Password == user.Password)
                      .Include(usr => usr.Role)
                     .FirstOrDefault();
                return getUser;
            }
        }
    }
}
