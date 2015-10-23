using System;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Common.Exceptions;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser.Impl
{
    public class CookieParser : ICookieParser
    {
        private const char Separator = ',';
        private const int RequiredArrayLenght = 2;

        private int _userId = -1;
        private string _userRoleName = "";

        public int GetUserId(FormsIdentity identity)
        {
            if (identity == null)
            {
                throw new ArgumentNullException("identity");
            }

            ParseData(identity.Ticket.UserData,
                out _userId,
                out _userRoleName);
            
            return _userId;
        }

        public string GetUserRoleName(FormsIdentity identity)
        {
            if (identity == null)
            {
                throw new ArgumentNullException("identity");
            }

            ParseData(identity.Ticket.UserData,
                out _userId,
                out _userRoleName);

            return _userRoleName;
        }

        public string GetUserLogin(FormsIdentity identity)
        {
            if (identity == null)
            {
                throw new ArgumentNullException("identity");
            }

            return identity.Ticket.Name;
        }

        private static void ParseData(string userData,
            out int userId, out string userRoleName)
        {
            var userDatacontent = userData.Split(Separator);
            if (userDatacontent.Length != RequiredArrayLenght)
            {
                throw new CookieParserException("Bad cookies data.");
            }

            userId = Convert.ToInt32(userDatacontent[0]);
            userRoleName = userDatacontent[1];
        }
    }
}