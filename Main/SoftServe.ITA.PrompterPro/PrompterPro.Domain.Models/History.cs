using System;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class History : BaseModel
    {
        public int HistoryId { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }

        public int ScriptId { get; set; }
        public int PrompterId { get; set; }

        public Script Script { get; set; }
        public User Prompter { get; set; }


    }
}
