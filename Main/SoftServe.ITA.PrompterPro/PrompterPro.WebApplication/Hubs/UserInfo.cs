namespace SoftServe.ITA.PrompterPro.WebApplication.Hubs
{
	public class UserInfo
	{
		public int Id { get; set; }
		public string Role { get; set; }
		public string Connection { get; set; }
		public GroupInfo Group { get; set; }
	}
}