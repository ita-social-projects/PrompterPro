using System.IO;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser
{
	public interface IPresentationParser
	{
		Script Parse(Stream stream);
	}
}
