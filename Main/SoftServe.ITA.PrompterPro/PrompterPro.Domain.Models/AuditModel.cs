using System;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class AuditModel : BaseModel
    {
	    public AuditModel()
	    {
			CreatedDate = DateTime.UtcNow;
			LastEditedDate = DateTime.UtcNow;
	    }

        public DateTime CreatedDate { get; set; }
        public DateTime LastEditedDate { get; set; }
    }
}
