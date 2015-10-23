using System.Data.Entity.ModelConfiguration;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.Mapping
{
    public class BaseMapping<T> : EntityTypeConfiguration<T> where T: class ,IStateModel
    {
        public BaseMapping()
        {
            Ignore(t => t.EntityState);
        }
    }
}
