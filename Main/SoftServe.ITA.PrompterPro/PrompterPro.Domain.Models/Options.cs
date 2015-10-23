using System.Collections.Generic;
using System.Data.Entity;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class Options : BaseModel
    {
        public int OptionsId { get; set; }
        public int FontSize { get; set; }
        public int ReadingSpeed { get; set; }
        public string AnnouncerName { get; set; }
        public string Description { get; set; }

        public List<Script> Scripts { get; set; }

        public Options()
        {
            FontSize = 10;
            ReadingSpeed = 10;
            AnnouncerName = "Default";

            EntityState = EntityState.Added;
        }
    }
}
