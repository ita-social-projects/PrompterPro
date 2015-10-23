using System;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
    public class TransferUserActivity : BaseModel
    {
        public int LogId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserRoleName { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
    }
}