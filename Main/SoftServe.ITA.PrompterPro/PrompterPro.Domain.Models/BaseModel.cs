using System.Data.Entity;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
   public class BaseModel : IStateModel
    {
        public EntityState EntityState { get; set; }

        public BaseModel()
        {
            EntityState = EntityState.Unchanged;
        }
    }
}
