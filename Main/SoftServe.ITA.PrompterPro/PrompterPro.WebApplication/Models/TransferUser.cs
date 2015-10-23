using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
    public class TransferUser : IStateModel
    {
        [Required]
        public int UserId { get; set; }
       
        public string Login { get; set; }
        public string PrompterStatus { get; set; }
        public string Password { get; set; }

        public bool Disabled { get; set; }

        public int RoleId { get; set; }

	    public TransferRole Role { get; set; }

        public EntityState EntityState { get; set; }
    }
}