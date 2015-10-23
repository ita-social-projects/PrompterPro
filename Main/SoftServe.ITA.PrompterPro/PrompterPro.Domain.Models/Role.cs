using System.Collections.Generic;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class Role : BaseModel
    {
        public int RoleId { get; set; }
        public string Name { get; set; }

        public List<User> Users { get; set; }
    }
}
