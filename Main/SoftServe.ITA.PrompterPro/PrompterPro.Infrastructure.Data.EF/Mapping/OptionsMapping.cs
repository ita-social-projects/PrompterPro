using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class OptionsMapping : BaseMapping<Options>
    {
        public OptionsMapping()
        {
            ToTable("Options");

            HasKey(t => t.OptionsId);
            Property(t => t.FontSize).IsRequired();
            Property(t => t.ReadingSpeed).IsRequired();
            Property(t => t.AnnouncerName).HasMaxLength(50)
                .IsRequired();
            Property(t => t.Description).HasMaxLength(500);
        }
    }
}
