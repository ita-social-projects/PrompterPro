using System;
using System.Collections.Generic;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class Script : AuditModel
    {
        public int ScriptId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }


        public int OperatorId { get; set; }
        public Nullable<int> PrompterId { get; set; }
        public int OptionsId { get; set; }

        public User Operator { get; set; }
        public User Prompter { get; set; }
        public Options Options { get; set; }
        
        public List<Section> Sections { get; set; }
        public List<History> Histories { get; set; }
    }
}
