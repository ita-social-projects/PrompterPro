using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class UserMapping : BaseMapping<User>
    {
        public UserMapping()
        {
            ToTable("Users");
            HasKey(t => t.UserId);
            Property(t => t.Login).HasMaxLength(50)
                .IsRequired();
            Property(t => t.Password).HasMaxLength(50)
                .IsRequired();
            Property(t => t.PrompterStatus).HasMaxLength(50);
            Property(t => t.Disabled).IsRequired();

            HasRequired(t => t.Role)
                .WithMany(role => role.Users)
                .HasForeignKey(t => t.RoleId)
                .WillCascadeOnDelete(false);
        }
    }
}