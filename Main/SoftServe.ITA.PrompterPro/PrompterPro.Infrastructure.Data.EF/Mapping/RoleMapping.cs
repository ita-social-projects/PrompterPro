using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class RoleMapping : BaseMapping<Role>
    {
        public RoleMapping()
        {
            ToTable("Roles");

            HasKey(t => t.RoleId);
            Property(t => t.Name).HasMaxLength(50)
                .IsRequired();
        }
    }
}
