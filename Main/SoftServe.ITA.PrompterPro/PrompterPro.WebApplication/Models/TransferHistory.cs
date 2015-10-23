using System;
using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
    public class TransferHistory : IStateModel
    {
        public int HistoryId { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }

        public int ScriptId { get; set; }
        public int PrompterId { get; set; }

	    public TransferScript Script { get; set; }
	    public TransferUser Prompter { get; set; }
        public EntityState EntityState { get; set; }
    }
}