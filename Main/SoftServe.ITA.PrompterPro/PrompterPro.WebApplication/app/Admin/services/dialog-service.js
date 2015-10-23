app.factory('dialogSevice', [
    '$modal', 'role', 'prompterStatus', 'validationService',
    'notify', 'notifyType', 'icons', 'constants', 'md5',
    function ($modal, role, prompterStatus, validationService, notify, notifyType, icons, constants, md5) {
        return {
            openAddDialog: function (size, $scope) {
                $scope.newUser = {
                    EntitySate      : null,
                    Login           : null,
                    Password        : null,
                    Disabled        : false,
                    PrompterStatus  : null,
                    Role:
                    {
                        EntityState : 2,
                        Name        : null,
                        RoleId      : null
                    },
                    RoleId          : null

                };

                var modalInstance = $modal.open({
                    templateUrl: 'addUserModal.html',
                    controller: 'modalAddInstanceController',
                    size: size,
                    resolve: {
                        newUser: function () {
                            return $scope.newUser;
                        }
                    }
                });

                modalInstance.result.then(function (newUser) {
                    if (modalInstance.result.$$state.value) {
                        if (validationService.checkUserExisting($scope.users, newUser.Login)) {
                            if (newUser.Role.Name === role.Admin.Name) {
                                newUser.RoleId = role.Admin.RoleId;
                                newUser.Role.RoleId = role.Admin.RoleId;
                            }
                            if (newUser.Role.Name === role.Operator.Name) {
                                newUser.RoleId = role.Operator.RoleId;
                                newUser.Role.RoleId = role.Operator.RoleId;
                            }
                            if (newUser.Role.Name === role.Prompter.Name) {
                                newUser.RoleId = role.Prompter.RoleId;
                                newUser.Role.RoleId = role.Prompter.RoleId;
                                newUser.PrompterStatus = prompterStatus.Off;
                            }
                            newUser.Password = md5.createHash(newUser.Password || '');
                            $scope.setAddedState(newUser);
                            $scope.addMangedUserToList(newUser);
                        } else {
                            notify(
                                notifyType.danger,
                                constants.usrerWithSameName,
                                icons.warning);
                        }
                    }
                });

            },
            openEditDialog: function (size, userForEditing, $scope) {
                var object = angular.copy(userForEditing);
                var modalInstance = $modal.open({
                    templateUrl: 'editUserModal.html',
                    controller: 'modalEditInstanceController',
                    size: size,
                    resolve: {
                        userForEditing: function () {
                            return object;
                        }
                    }
                });

                modalInstance.result.then(function(editUser) {
                    if (modalInstance.result.$$state.value) {
                        var index = $scope.users.indexOf(userForEditing);
                        validationService.checkUsersRole($scope.users[index], editUser);
                        $scope.users[index] = editUser;
                        $scope.setUpdatedState(editUser);
                        $scope.addMangedUserToList(editUser);
                    }
                });

            }
        }
    }
]);