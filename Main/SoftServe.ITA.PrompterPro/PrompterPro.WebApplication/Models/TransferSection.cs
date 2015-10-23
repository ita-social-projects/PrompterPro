using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
    public class TransferSection : IStateModel
    {
        public int SectionId { get; set; }
        public int Order { get; set; }
        public string Text { get; set; }

        public int ScriptId { get; set; }
        public EntityState EntityState { get; set; }
    }
}