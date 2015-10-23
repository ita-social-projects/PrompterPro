using System;
using System.Runtime.Serialization;

namespace SoftServe.ITA.PrompterPro.Common.Exceptions
{
    [Serializable]
    public class CookieParserException : Exception
    {
        public CookieParserException()
        {
        }

        public CookieParserException(string message)
            : base(message)
        {
        }

        public CookieParserException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        protected CookieParserException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
