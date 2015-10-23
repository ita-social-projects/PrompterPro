using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;

namespace SoftServe.ITA.PrompterPro.Domain.Services.Impl
{

    public class ScriptService : IScriptService
    {
        private readonly IPrompterDbContextFactory _dbContextFactory;

        public ScriptService(IPrompterDbContextFactory dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public IList<Script> FetchAllScripts()
        {
            using (IPrompterDbContext context = _dbContextFactory.Create())
            {
                var scripts = context.Scripts
                        .Include(script => script.Sections)
                        .Include(script => script.Options)
                        .ToList();

                foreach (var script in scripts)
                {
                    script.Sections = script.Sections
                        .OrderBy(c => c.Order)
                        .ToList();
                }

                return scripts;
            }
        }

		public IList<Script> FetchScriptsByOperatorId(int operatorId)
		{
			using (IPrompterDbContext context = _dbContextFactory.Create())
			{
				var scripts = context.Scripts
						.Where(script => script.OperatorId == operatorId)
						.Include(script => script.Sections)
						.Include(script => script.Options)
						.ToList();

				foreach (var script in scripts)
				{
					script.Sections = script.Sections
						.OrderBy(c => c.Order)
						.ToList();
				}

				return scripts;
			}
		}

        public Script FetchScriptById(int scriptId)
        {
            using (IPrompterDbContext context = _dbContextFactory.Create())
            {
                var selectedScript = context.Scripts
                    .Where(script => script.ScriptId == scriptId)
                    .Include(script => script.Options)
                    .Include(script => script.Sections)
                    .FirstOrDefault();
                if (selectedScript != null)
                {
                    selectedScript.Sections = selectedScript.Sections
                        .OrderBy(c => c.Order)
                        .ToList();
                }
                return selectedScript;
            }
        }

        public void SaveScript(Script script)
        {
            using (var context = _dbContextFactory.Create())
            {
                context.Attach(script);
                context.SaveChanges();
            }
        }

        public void SaveScripts(IList<Script> scripts)
        {
            if (scripts == null)
            {
                throw new ArgumentNullException("scripts");
            }
            using (var context = _dbContextFactory.Create())
            {
                foreach (var script in scripts)
                {
                    context.Attach(script);
                }

                context.SaveChanges();
            }

        }
    }
}

