describe("Admin controller - user controller", function() {
    var isManageUserSateCalled = false;
    var isNotifyCalled = false;
    var isManageListOfUsersCalled = false;
    var isDialogServiceCalled = false;
    var isServerServiceCalled = false;

    var mockDependencies = function () {
        module(function ($provide) {
            $provide.service("manageUserSate", function () {
                this.setModifiedState = function() {
                    isManageUserSateCalled = true;
                };
                this.setDeletedState = function() {
                    isManageUserSateCalled = true;
                };
                this.setAddedState = function() {
                    isManageUserSateCalled = true;
                };
            });

            $provide.service("validationService", function () {
                this.checkIfAdmin = function(user) {
                    return user.Role === "Admin";
                }
            });

            $provide.service("notify", function () {
                return function() {
                    isNotifyCalled = true;
                }
            });

            $provide.service("manageListOfUsers", function () {
                this.addToList = function() {
                    isManageListOfUsersCalled = true;
                }
                this.removeFromList = function () {
                    isManageListOfUsersCalled = true;
                }
            });

            $provide.service("dialogSevice", function () {
                this.openEditDialog = function () {
                    isDialogServiceCalled = true;
                }
                this.openAddDialog = function () {
                    isDialogServiceCalled = true;
                }
            });

            $provide.service("serverService", function () {
                this.readAllUsers = function () {
                    isServerServiceCalled = true;
                }
                this.manageUser = function () {
                    isServerServiceCalled = true;
                }
            });
        });
    };

    beforeEach(function () {
        module("app");
        mockDependencies();
    });

    afterEach(function() {
        isManageUserSateCalled = false;
        isNotifyCalled = false;
        isManageListOfUsersCalled = false;
        isDialogServiceCalled = false;
        isServerServiceCalled = false;
    });

    describe("User controller test", function() {
        var controller,
            entityState,
            $scope = {};

        beforeEach(inject(function($injector, $controller) {
            controller = $controller("usersController",
            { $scope: $scope });

            entityState = $injector.get("entityState");
        }));

        it("controller exists", function() {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function() {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can set is deleted", function () {
            //arange
            //act
            $scope.setIsDeleted();

            //assert
            expect($scope.isDeleted).toBe(true);
        });

        it("can set is edited", function () {
            //arange
            //act
            $scope.setIsEdited(true);

            //assert
            expect($scope.isEdited).toBe(true);
        });

        it("can set show odd and even", function () {
            //arange
            //act
            $scope.setShowOddAndEven(true);

            //assert
            expect($scope.showOddAndEven).toBe(true);
        });

        it("can set show edit delete", function () {
            //arange
            //act
            $scope.setShowEditDelete(true);

            //assert
            expect($scope.showEditDelete).toBe(true);
        });

        it("can set show ok remove", function () {
            //arange
            //act
            $scope.setShowOkRemove(true);

            //assert
            expect($scope.showOkRemove).toBe(true);
        });

        describe("show prom status will set showPrompterStatus based on role name", function() {
            it("will set showPrompterStatus to true if role name is Prompter", function () {
                //arange
                var name = "Prompter";

                //act
                $scope.showPromStatus(name);

                //assert
                expect($scope.showPrompterStatus).toBe(true);
            });

            it("will set showPrompterStatus to false if role name is not Prompter", function () {
                //arange
                var name = "Test";

                //act
                $scope.showPromStatus(name);

                //assert
                expect($scope.showPrompterStatus).toBe(false);
            });
        });
        
        it("can set update state", function () {
            //arange
            //act
            $scope.setUpdatedState();

            //assert
            expect(isManageUserSateCalled).toBe(true);
        });

        it("can set deleted state", function () {
            //arange
            //act
            $scope.setDeletedState();

            //assert
            expect(isManageUserSateCalled).toBe(true);
        });

        it("can set added state", function () {
            //arange
            $scope.users = [];

            //act
            $scope.setAddedState("test");

            //assert
            expect(isManageUserSateCalled).toBe(true);
            expect($scope.users[0]).toBe("test");
        });

        describe("delete current user function", function() {
            it("wont delete user with role 'Admin'", function() {
                //arange
                var user = {
                    Role: "Admin"
                };

                //act
                $scope.deleteCurrentUser(user);

                //assert
                expect(isNotifyCalled).toBe(true);
            });

            it("will splice user with added entity state from array", function () {
                //arange
                var user = {
                    Role: "Prompter",
                    EntityState: entityState.Added
                };

                $scope.managedUserslist.push(user);

                //act
                $scope.deleteCurrentUser(user);

                //assert
                expect(isManageListOfUsersCalled).toBe(true);
            });

            it("will set users state as deleted if user is not added", function () {
                //arange
                var user = {
                    Role: "Prompter",
                    EntityState: entityState.Modified
                };

                $scope.managedUserslist.push(user);

                //act
                $scope.deleteCurrentUser(user);

                //assert
                expect(isManageListOfUsersCalled).toBe(true);
                expect(isManageUserSateCalled).toBe(true);
            });
        });

        it("can open edit dialog", function() {
            //arange
            //act
            $scope.openEditDialog();

            //assert
            expect(isDialogServiceCalled).toBe(true);
        });

        it("can open add dialog", function () {
            //arange
            //act
            $scope.openAddDialog();

            //assert
            expect(isDialogServiceCalled).toBe(true);
        });

        it("can add managed user to list", function () {
            //arange
            //act
            $scope.addMangedUserToList();

            //assert
            expect(isManageListOfUsersCalled).toBe(true);
        });

        it("can remove managed user to list", function () {
            //arange
            //act
            $scope.removeFromList();

            //assert
            expect(isManageListOfUsersCalled).toBe(true);
        });

        it("can get user for edit", function () {
            //arange
            var user = "Test";

            //act
            $scope.getUserForEditing(user);

            //assert
            expect($scope.userForEditing).toEqual(user);
        });

        it("can fetch users", function () {
            //arange
            //act
            $scope.fetchUsers();

            //assert
            expect(isServerServiceCalled).toEqual(true);
        });

        describe("save all changes function", function() {
            it("will save users if there are some users in managedUserslist", function() {
                //arange
                $scope.managedUserslist.push("test");

                //act
                $scope.saveAllChanges();

                //assert
                expect(isServerServiceCalled).toBe(true);
                expect(isNotifyCalled).toBe(true);
            });

            it("will notify that no changes was made", function () {
                //arange
                //act
                $scope.saveAllChanges();

                //assert
                expect(isServerServiceCalled).toBe(false);
                expect(isNotifyCalled).toBe(true);
            });
        });
    });
});