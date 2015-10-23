using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class ScriptMapping : BaseMapping<Script>
    {
        public ScriptMapping()
        {
            ToTable("Scripts");

            HasKey(t => t.ScriptId);
            Property(t => t.Title).HasMaxLength(250)
                .IsRequired();
            Property(t => t.CreatedDate).IsRequired();
            Property(t => t.LastEditedDate).IsRequired();
            Property(t => t.Description).HasMaxLength(500);
	        Property(t => t.PrompterId).IsOptional();

            HasRequired(t => t.Operator)
                .WithMany()
                .HasForeignKey(t => t.OperatorId)
                .WillCascadeOnDelete(false);

            HasOptional(t => t.Prompter)
                .WithMany()
                .HasForeignKey(t => t.PrompterId)
                .WillCascadeOnDelete(false);

            HasRequired(t => t.Options)
                .WithMany(t => t.Scripts)
                .HasForeignKey(t => t.OptionsId)
                .WillCascadeOnDelete(false);
        }
    }
}
