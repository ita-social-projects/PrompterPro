using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl
{
    public class SectionMapper : ISectionMapper
    {
        public TransferSection Map(Section section)
        {
            if (section == null)
            {
                return null;
            }
            return new TransferSection
            {
                SectionId = section.SectionId,
                Order = section.Order,
                Text = section.Text,

                ScriptId = section.ScriptId,

                EntityState = EntityState.Unchanged
            };
        }

        public Section Map(TransferSection transferSection)
        {
            if (transferSection == null)
            {
                return null;
            }
            return new Section
            {
                SectionId = transferSection.EntityState == EntityState.Added
                ? transferSection.Order : transferSection.SectionId,
                Order = transferSection.Order,
                Text = transferSection.Text,

                ScriptId = transferSection.ScriptId,
                EntityState = transferSection.EntityState
            };
        }
    }
}