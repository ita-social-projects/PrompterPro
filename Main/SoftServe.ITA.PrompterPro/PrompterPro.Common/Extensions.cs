using System;

namespace SoftServe.ITA.PrompterPro.Common
{
    // TODO : Correct name
    public static class Extensions
    {
		public static void CheckForNull(this object value, string parameterName)
        {
			if (value == null)
            {
	            throw new ArgumentNullException(parameterName);
            }
        }
    }
}
