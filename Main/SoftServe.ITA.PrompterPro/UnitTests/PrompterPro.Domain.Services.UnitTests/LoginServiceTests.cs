using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Moq;
using NUnit.Framework;
using SoftServe.ITA.PrompterPro.Domain.Models;
using SoftServe.ITA.PrompterPro.Domain.Services.Impl;
using SoftServe.ITA.PrompterPro.Infrastructure.Data.EF.PrompterDbContext;

namespace SoftServe.ITA.PrompterPro.Domain.Services.UnitTests
{
    [TestFixture]
    public class LoginServiceTests
    {

        [Test]
        public void GetUser_Test()
        {
            //Arange
            IQueryable<User> users = GetUsers();
            ILoginService service = CreateLoginService(users);

            //Act

            var expected = new User
            {
                UserId = 1,
                Disabled = false,
                Login = "Admin",
                Password = "Admin",
                RoleId = 1,
                Role = new Role
                {
                    Name = "Admin"
                }
            };

            var actual = service.GetUser(new User
            {
                Login = "Admin",
                Password = "Admin"
            });
            
            //Assert
            Assert.IsTrue(AreUsersEqual(actual, expected));
        }

        [Test]
        public void GetUserNull_Test()
        {
            //Arange
            IQueryable<User> users = GetUsers();
            ILoginService service = CreateLoginService(users);

            //Act
            var actual = service.GetUser(null);

            //Assert
            Assert.That(actual, Is.Null);
        }

        [Test]
        public void GetUserLoginLessThree_Test()
        {
            //Arange
            IQueryable<User> users = GetUsers();
            ILoginService service = CreateLoginService(users);

            //Act
            var actual = service.GetUser(new User
            {
                Login = "Ad",
                Password = "Ad"
            });

            //Assert
            Assert.That(actual, Is.Null);
        }
        private static bool AreUsersEqual(User user, User expectedUser)
        {
            if (user == null)
            {
                return false;
            }

            return (user.Login == expectedUser.Login ||
                   user.Password == expectedUser.Password);
        }
        private static LoginService CreateLoginService(IQueryable<User> users)
        {
            var stubFactory = CreateMockFactory(users);

            var service = new LoginService(stubFactory.Object);
            return service;
        }

        private static Mock<IPrompterDbContextFactory> CreateMockFactory(IQueryable<User> users)
        {
            var stubFactory = new Mock<IPrompterDbContextFactory>();
            var stubContext = new Mock<IPrompterDbContext>();
            var userDbSet = new Mock<IDbSet<User>>();


            stubFactory.Setup(s => s.Create())
                .Returns(stubContext.Object);

            SetUpUserDbSet(users, userDbSet);

            stubContext.Setup(s => s.Users)
                .Returns(userDbSet.Object);
            return stubFactory;
        }

        private static void SetUpUserDbSet(IQueryable<User> users, Mock<IDbSet<User>> userDbSet)
        {
            userDbSet.Setup(s => s.Provider)
                .Returns(users.Provider);
            userDbSet.Setup(s => s.Expression)
                .Returns(users.Expression);
            userDbSet.Setup(s => s.GetEnumerator())
                .Returns(users.GetEnumerator());
        }

        private static IQueryable<User> GetUsers()
        {
            var user = new User
            {
                UserId = 1,
                Disabled = false,
                Login = "Admin",
                Password = "Admin",
                RoleId = 1,
                Role = new Role
                {
                    Name = "Admin"
                }
            };

            var users = new List<User>
            {
                user,
                new User
                {
                    UserId = 2
                }
            }.AsQueryable();
            return users;
        }
    }
}
