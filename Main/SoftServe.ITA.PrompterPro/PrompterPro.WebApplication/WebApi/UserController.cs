using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using SoftServe.ITA.PrompterPro.Domain.Services;
using SoftServe.ITA.PrompterPro.WebApplication.Models;
using SoftServe.ITA.PrompterPro.WebApplication.Models.Mappers;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.UserActivityActionFilters;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebApi
{
    [Authorize(Roles = "Admin, Operator")]
    [WebApiLogActionFilter]
    public class UserController : ApiController
    {
        private readonly IUserService _userService;
        private readonly IUserMapper _userMapper;

        public UserController(IUserService userService,
            IUserMapper userMapper)
        {
            _userService = userService;
            _userMapper = userMapper;
        }

        public IList<TransferUser> Get()
        {
            return _userService.FetchUsers()
                .Select(user => _userMapper.Map(user))
                .ToList();
        }
        //public HttpStatusCode Get(string login)
        //{
        //    if (login == null)
        //    {
        //        throw new ArgumentNullException("login");
        //    }
            
        //    var existUser = _userService.FetchUserByLogin(login.ToString());
        //    if (existUser != null)
        //    {
        //        return HttpStatusCode.Found;
        //    }
        //    return HttpStatusCode.NotFound;

        //}

        public IList<TransferUser> Post(IList<TransferUser> users)
        {
            if (users == null)
            {
                throw  new ArgumentNullException("users");
            }

            _userService.SaveUsers(users.Select(user => _userMapper.Map(user)).ToList());

            return _userService.FetchUsers()
               .Select(user => _userMapper.Map(user))
               .ToList();
        }
     
    }
}
