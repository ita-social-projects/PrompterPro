using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class UserActivityMapping : BaseMapping<UserActivity>
    {
        public UserActivityMapping()
        {
            ToTable("UserActivity");

            HasKey(t => t.LogId);
            Property(t => t.UserId).IsRequired();
            Property(t => t.UserName).IsRequired()
                .HasMaxLength(50);
            Property(t => t.UserRoleName).IsRequired()
                .HasMaxLength(50);
            Property(t => t.Date).IsRequired();
            Property(t => t.Description).IsRequired();
        }
    }
}
