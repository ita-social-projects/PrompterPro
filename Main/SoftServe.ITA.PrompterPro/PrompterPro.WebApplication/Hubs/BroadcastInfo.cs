using System.Collections.Generic;

namespace SoftServe.ITA.PrompterPro.WebApplication.Hubs
{
    public class BroadcastInfo
    {
        public int ScriptId { get; set; }
        public List<int> PrompterIdList { get; set; }
    }
}