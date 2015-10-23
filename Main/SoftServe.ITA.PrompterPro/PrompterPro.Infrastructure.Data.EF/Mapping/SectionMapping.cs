using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    class SectionMapping : BaseMapping<Section>
    {
        public SectionMapping()
        {
            ToTable("Sections");

            HasKey(t => t.SectionId);
            Property(t => t.Order).HasColumnName("Order")
                .IsRequired();
            Property(t => t.Text).IsRequired();

            HasRequired(t => t.Script)
                .WithMany(t => t.Sections)
                .HasForeignKey(t => t.ScriptId)
                .WillCascadeOnDelete(false);
        }
    }
}
