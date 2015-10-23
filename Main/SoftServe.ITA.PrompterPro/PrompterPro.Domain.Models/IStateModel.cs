using System.Data.Entity;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public interface IStateModel
    {
        EntityState EntityState { get; set; }
      
    }
}
