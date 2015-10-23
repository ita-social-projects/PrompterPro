using System;
using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl
{
    public class UserActivityMapper : IUserActivityMapper
    {
        public TransferUserActivity Map(UserActivity log)
        {
            if (log == null)
            {
                throw new ArgumentNullException("log");
            }
            return new TransferUserActivity
            {
                Date = log.Date,
                Description = log.Description,
                LogId = log.LogId,
                UserId = log.UserId,
                UserName = log.UserName,
                UserRoleName = log.UserRoleName,
                EntityState = EntityState.Unchanged
            };
        }

        public UserActivity Map(TransferUserActivity log)
        {
            if (log == null)
            {
                throw new ArgumentNullException("log");
            }

            return new UserActivity
            {
                Date = log.Date,
                Description = log.Description,
                EntityState = log.EntityState,
                LogId = log.LogId,
                UserId = log.UserId,
                UserName = log.UserName,
                UserRoleName = log.UserRoleName
            };
        }
    }
}