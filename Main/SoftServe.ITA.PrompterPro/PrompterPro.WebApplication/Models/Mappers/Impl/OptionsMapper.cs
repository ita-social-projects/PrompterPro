using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers.Impl
{
    public class OptionsMapper : IOptionsMapper
    {
        public TransferOptions Map(Options options)
        {
            if (options == null)
            {
                return null;
            }

            return new TransferOptions
            {
                OptionsId = options.OptionsId,
                AnnouncerName = options.AnnouncerName,
                Description = options.Description,
                FontSize = options.FontSize,
                ReadingSpeed = options.ReadingSpeed,

				EntityState = EntityState.Unchanged
            };
        }

        public Options Map(TransferOptions transferOptions)
        {
            if (transferOptions == null)
            {
                return null;
            }
            return new Options
            {
                AnnouncerName = transferOptions.AnnouncerName,
                Description = transferOptions.Description,
                FontSize = transferOptions.FontSize,
                OptionsId = transferOptions.OptionsId,
                ReadingSpeed = transferOptions.ReadingSpeed,
                EntityState = transferOptions.EntityState
            };
        }
    }
}