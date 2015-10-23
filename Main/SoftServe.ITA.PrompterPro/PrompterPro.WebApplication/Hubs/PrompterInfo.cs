namespace SoftServe.ITA.PrompterPro.WebApplication.Hubs
{
    public class PrompterInfo
    {
        public int PrompterId { get; set; }
        public bool? IsMirroredX { get; set; }
        public bool? IsMirroredY { get; set; }
        public ScreenResolution Resolution { get; set; }

    }
}