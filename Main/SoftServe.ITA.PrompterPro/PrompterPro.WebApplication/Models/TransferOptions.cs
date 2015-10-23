using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
    public class TransferOptions :IStateModel
    {
        public int OptionsId { get; set; }
        public int FontSize { get; set; }
        public int ReadingSpeed { get; set; }
        public string AnnouncerName { get; set; }
        public string Description { get; set; }
        public EntityState EntityState { get; set; }
       
    }
}