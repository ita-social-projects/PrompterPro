using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
	public class TransferRole : IStateModel
	{
		public int RoleId { get; set; }
		public string Name { get; set; }
        public EntityState EntityState { get; set; }
	}
}