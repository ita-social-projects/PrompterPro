using System;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class UserActivity : BaseModel
    {
        public int LogId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserRoleName { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
    }
}
