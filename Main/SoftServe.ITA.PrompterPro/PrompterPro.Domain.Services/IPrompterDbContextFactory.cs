using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;

namespace SoftServe.ITA.PrompterPro.Domain.Services
{
	public interface IPrompterDbContextFactory
	{
		IPrompterDbContext Create();
	}
}
