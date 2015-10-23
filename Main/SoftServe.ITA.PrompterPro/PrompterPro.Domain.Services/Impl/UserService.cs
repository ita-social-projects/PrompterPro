using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using SoftServe.ITA.PrompterPro.Common;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;

namespace SoftServe.ITA.PrompterPro.Domain.Services.Impl
{
    public class UserService: IUserService
    {
        private readonly IPrompterDbContextFactory _dbContextFactory;
        private readonly IEvents _events;
        private const int Prompter = 3;
        public UserService(IPrompterDbContextFactory dbContextFactory, IEvents events)
	    {
		    _dbContextFactory = dbContextFactory;
            _events = events;
	    }
        
        public IList<User> FetchUsers()
        {
            using (IPrompterDbContext context = _dbContextFactory.Create())
            {
                return context.Users
                    .Include(user => user.Role)
                    .ToList();
            }
        }

        public User FetchUserByLogin(string login)
        {
            if (login == null)
            {
                throw new ArgumentNullException("login");
            }
            using (var context = _dbContextFactory.Create())
            {
                var existUser = context.Users
                    .Include(user => user.Role)
                    .FirstOrDefault(user => user.Login == login);

                return existUser;
            }
            
        }
        public void SaveUsers(IList<User> users)
        {
            bool isPrompter = new bool();
            if (users == null)
            {
                throw new ArgumentNullException("users");
            }
            using (var context = _dbContextFactory.Create())
            {
                foreach (var user in users)
                {
                    context.Attach(user);
                    if (user.RoleId == Prompter)
                    {
                        isPrompter = true;
                    }
                }
                context.SaveChanges();

                if (isPrompter)
                {
                    isPrompter = false;
                    _events.RaiseOnPrompterChange(this);
                }
            }
        }
                   
        public IList<User> FetchAllPrompters()
        {
            using (IPrompterDbContext context = _dbContextFactory.Create())
            {
                return context.Users
                    .Include(user => user.Role)
                    .Where(user => !user.Disabled 
                        && user.RoleId == Prompter)
                    .ToList();
            }
        }
        
        public void ChangePrompterStatus(int id, string status)
        {
            using (IPrompterDbContext context = _dbContextFactory.Create())
            {
                User prompter = context.Users
                    .Include(user => user.Role)
                    .FirstOrDefault(user => user.UserId == id && !user.Disabled
                                            && user.RoleId == Prompter);
                if (prompter == null)
                {
                    //throw new ArgumentNullException(Prompter.ToString());
                    return;
                }
                prompter.PrompterStatus = status;
                prompter.EntityState = EntityState.Modified;
                context.Attach(prompter);
                context.SaveChanges();
                _events.RaiseOnPrompterChange(this);

            }
        }

        
    }
}
