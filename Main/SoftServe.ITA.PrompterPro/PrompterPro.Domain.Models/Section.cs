namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class Section : BaseModel
    {
        public int SectionId { get; set; }
        public int Order { get; set; }
        public string Text { get; set; }

        public int ScriptId { get; set; }

        public Script Script { get; set; }
    }
}
