using System;
using System.Web;
using System.Web.Security;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Security
{
    public class WebSecurity : IWebSecurity
    {

        public HttpCookie Authorize(User user)
        {
            if (user == null)
            {
                return null;
            }
            FormsAuthenticationTicket ticket = GetTicket(user);
            if (ticket == null)
            {
                return null;
            }
            string encryptedTicket = FormsAuthentication.Encrypt(ticket);
            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);

            if (ticket.IsPersistent)
            {
                cookie.Expires = ticket.Expiration;
            }

            return cookie;
        }

        private static FormsAuthenticationTicket GetTicket(User user)
        {
            if (user == null)
            {
                return null;
            }
            const int version = 1;
            const int days = 7;
            const char separator = ',';
            string cookieName = user.Login.Trim();
            string userData = user.UserId.ToString() + separator + user.Role.Name;
            string cookiePath = FormsAuthentication.FormsCookiePath;
            DateTime currentDate = DateTime.Now;
            DateTime expirationDate = currentDate.AddDays(days);

            FormsAuthentication.Initialize();
            return
                new FormsAuthenticationTicket(version: version,
                    name: cookieName,
                    issueDate: currentDate,
                    expiration: expirationDate,
                    isPersistent: true,
                    userData: userData,
                    cookiePath: cookiePath
            );
        }
    }
}