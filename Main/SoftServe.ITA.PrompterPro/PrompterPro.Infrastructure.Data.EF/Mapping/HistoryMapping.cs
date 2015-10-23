using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class HistoryMapping : BaseMapping<History>
    {
        public HistoryMapping()
        {
            ToTable("History");
            
            HasKey(t => t.HistoryId);
            Property(t => t.Description);
            Property(t => t.Date).IsRequired();

            HasRequired(t => t.Prompter).WithMany()
                .HasForeignKey(t => t.PrompterId)
                .WillCascadeOnDelete(false);

            HasRequired(t => t.Script)
                .WithMany(t => t.Histories)
                .HasForeignKey(t => t.ScriptId)
                .WillCascadeOnDelete(false);
        }
    }
}
