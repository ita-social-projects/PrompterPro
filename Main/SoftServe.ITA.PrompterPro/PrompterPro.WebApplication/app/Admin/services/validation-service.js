app.factory('validationService', [
    'entityState', 'role',
    function(entityState, role) {
        return {
            checkUserExisting: function(users, login) {
                var length = users.length;
                for (var i = 0; i < length; i++) {
                    if (users[i].Login === login) {
                        return false;
                    }
                }
                return true;
            },

            checkUsersRole: function(oldUser, newUser) {
                if (oldUser.Role.Name !== newUser.Role.Name) {
                    if (role.Admin.Name === newUser.Role.Name) {
                        newUser.Role = role.Admin;
                        newUser.RoleId = role.Admin.RoleId;
                        newUser.PrompterStatus = null;
                    }
                    if (role.Operator.Name === newUser.Role.Name) {
                        newUser.Role = role.Operator;
                        newUser.RoleId = role.Operator.RoleId;
                        newUser.PrompterStatus = null;
                    }
                    if (role.Prompter.Name === newUser.Role.Name) {
                        newUser.Role = role.Prompter;
                        newUser.RoleId = role.Prompter.RoleId;
                        newUser.PrompterStatus = 'Off';
                    }
                }
            },
            checkIfAdmin: function(user) {
                if (user.Login === 'Admin' && user.Role.Name === 'Admin') {
                    return true;
                }
                return false;
            }
        }
    }
]);