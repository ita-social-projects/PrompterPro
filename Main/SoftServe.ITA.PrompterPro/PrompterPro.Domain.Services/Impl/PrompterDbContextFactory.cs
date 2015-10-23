using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext.Impl;

namespace SoftServe.ITA.PrompterPro.Domain.Services.Impl
{
	public class PrompterDbContextFactory : IPrompterDbContextFactory
	{
		public IPrompterDbContext Create()
		{
			return new PrompterDbContext();
		}
	}
}
