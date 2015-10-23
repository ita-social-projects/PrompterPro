using System.Collections.Generic;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.Domain.Services
{
    public interface IScriptService
    {
        IList<Script> FetchAllScripts();
	    IList<Script> FetchScriptsByOperatorId(int operatorId);
        Script FetchScriptById(int scriptId);

	    void SaveScript(Script script);
        void SaveScripts(IList<Script> scripts);
    }
}
