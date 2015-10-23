using System;
using System.Collections.Generic;
using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
    public class TransferScript : AuditModel
    {
        public int ScriptId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int OperatorId { get; set; }
        public Nullable<int> PrompterId { get; set; }
        public int OptionsId { get; set; }

	    public TransferUser Operator { get; set; }
	    public TransferUser Prompter { get; set; }
	    public TransferOptions Options { get; set; }

	    public List<TransferSection> Sections { get; set; }

    }
}