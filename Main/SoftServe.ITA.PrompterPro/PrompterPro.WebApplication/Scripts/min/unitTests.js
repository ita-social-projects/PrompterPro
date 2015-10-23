describe("Common webApi", function() {
    beforeEach(module("app"));

    describe("webApi service tests", function() {
        var service;

        beforeEach(inject(function($injector) {
            service = $injector.get("webApi");
        }));

        it("should return pack of constants", function() {
            //assert
            expect(service.presentation).toBe("/api/presentation");
            expect(service.script).toBe("/api/script");
            expect(service.prompter).toBe("/api/prompter");
            expect(service.diagnostics).toBe("/api/diagnostics");
            expect(service.userActivity).toBe("/api/userActivity");
            expect(service.userActivityActivator).toBe("/api/userActivityActivator");
        });
    });
});
describe("Admin controller - admin controller", function () {

    beforeEach(module("app"));

    describe("Admin controller test", function () {
        var controller,
            $scope = {};

        beforeEach(inject(function ($injector, $controller) {
            controller = $controller("adminController",
                { $scope: $scope });
        }));

        it("controller exists", function () {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function () {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can make user tab", function() {
            //arange
            //act
            $scope.makeUserTab();

            //asert
            expect($scope.isUsersTabActive).toBe(true);
            expect($scope.isDiagnosticsTabActive).toBe(false);
            expect($scope.isHistoryTabActive).toBe(false);
        });

        it("can make diagnostic tab", function () {
            //arange
            //act
            $scope.makeDiagnosticsTab();

            //asert
            expect($scope.isUsersTabActive).toBe(false);
            expect($scope.isDiagnosticsTabActive).toBe(true);
            expect($scope.isHistoryTabActive).toBe(false);
        });

        it("can make hostory tab", function () {
            //arange
            //act
            $scope.makeHistoryTab();

            //asert
            expect($scope.isUsersTabActive).toBe(false);
            expect($scope.isDiagnosticsTabActive).toBe(false);
            expect($scope.isHistoryTabActive).toBe(true);
        });

        it("can click on element", function() {
            //arange
            var oldGetElementById = document.getElementById;
            var actual;
            var dummyElement = {
                click: function() {
                    actual = "Tested";
                }
            };

            document.getElementById = function() {
                return dummyElement;
            }

            //act
            $scope.autoClick("Test");

            //assert
            expect(actual).toBe("Tested");

            //return old document.getElementById
            document.getElementById = oldGetElementById;
        });
    });
});
describe("Admin controller - datepicker controller", function() {

    beforeEach(module("app"));

    describe("Admin datepicker controller test", function() {
        var controller,
            $scope = {
                $watch: function() {}
            };

        beforeEach(inject(function($injector, $controller) {
            controller = $controller("datepickerController",
            { $scope: $scope });
        }));

        it("controller exists", function() {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function() {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can set last period", function() {
            //arange
            var date = new Date().setDate(
                new Date().getDate() - 7
                );

            //act
            $scope.lastPeriod();

            //assert
            expect($scope.dt).toBe(date);
        });

        it("can clear last period", function () {
            //arange
            //act
            $scope.clear();

            //assert
            expect($scope.dt).toBe(null);
        });

        it("can get current day", function () {
            //arange
            var date = new Date();

            //act
            //assert
            expect($scope.today).toEqual(date);
        });

        it("can open", function() {
            //arange
            var event = {
                preventDefault: function() {},
                stopPropagation: function() {}
            };

            spyOn(event, "preventDefault");
            spyOn(event, "stopPropagation");

            //act
            $scope.open(event);

            //assert
            expect($scope.opened).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopPropagation).toHaveBeenCalled();
        });
    });
});
describe("Admin controller - diagnostic controller", function() {
    var isModalOpenCalled = false;

    var mockDependencies = function() {
        module(function($provide) {
            $provide.service("$modal", function() {
                this.open = function() {
                    isModalOpenCalled = true;
                }
            });

            $provide.service("constants", function() {
                this.diagnositcsMessageDisplayLength = 1;
            });
        });
    };

    beforeEach(function() {
        module("app");
        mockDependencies();
    });

    describe("Diagnostic controller test", function () {
        var controller,
            $scope = {};

        beforeEach(inject(function($injector, $controller) {
            controller = $controller("diagnosticsController",
            { $scope: $scope });
        }));

        it("controller exists", function() {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function() {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can open message modal", function() {
            //arange
            var diagnostic = {
                Message: "Test"
            }

            //act
            $scope.openMessageModal(diagnostic);

            //assert
            expect(isModalOpenCalled).toBe(true);
        });
    });
});
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
describe("Admin services", function() {

    beforeEach(module("app"));

    describe("Diagnostics service test", function() {
        var service,
            $httpBackend;
        
        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");

            $httpBackend.when("GET", "/api/diagnostics")
                            .respond("test get respond");
            $httpBackend.when("GET", "/api/diagnostics?fromDate=1488")
                            .respond("test get with date respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("diagnosticsService");
            mockHttpRequests($injector);
        }));

        it("exists", function() {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can send get http request", function() {
            //arange
            var actual;

            //act
            var result = service.getLastDiagnostics();

            result.then(function(result) {
                actual = result;
            });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test get respond");
        });

        it("can send get http request with some date", function () {
            //arange
            var actual;
            var date = 1488;

            //act
            var result = service.getFromDate(date);

            result.then(function (result) {
                actual = result;
            });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test get with date respond");
        });
    });
});
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-mocks.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-animate.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/truncate.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-route.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-ui/ui-bootstrap.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/jquery-1.9.1.js" />
/// <reference path="../../../../Common/angular-md5.js" />

/// <reference path="../../../../app.js" />

describe("Admin controllers - anus controller", function () {

    beforeEach(module("app"));

    describe("Broadcast admin controller test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("broadcastOperator");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });
    });
});
describe("Admin services - manage list of users service", function () {

    beforeEach(module("app"));

    describe("Manage list of users test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("manageListOfUsers");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can add user to list", function () {
            //arange
            var scope = {
                managedUserslist: []
            }
            var user = "testUser";

            //act
            service.addToList(scope, user);

            //assert
            expect(scope.managedUserslist[0]).toBe("testUser");
        });

        it("can remove user from list", function () {
            //arange
            var scope = {
                users: [
                    "testUser",
                    "testUser2"
                ]
            }
            var user = "testUser";

            //act
            service.removeFromList(scope, user);

            //assert
            expect(scope.users[0]).toBe("testUser2");
            expect(scope.users.length).toBe(1);
        });
    });
});
describe("Admin services - manage user state service", function () {

    beforeEach(module("app"));

    describe("Manage user state service test", function () {
        var service,
            entityState;

        beforeEach(inject(function ($injector) {
            service = $injector.get("manageUserSate");
            entityState = $injector.get("entityState");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can set user entity state as added", function() {
            //arange
            var user = {};

            //act
            service.setAddedState(user);

            //assert
            expect(user.EntityState).toBe(entityState.Added);
        });

        it("can set user entity state as modified", function () {
            //arange
            var user = {};

            //act
            service.setModifiedState(user);

            //assert
            expect(user.EntityState).toBe(entityState.Modified);
        });

        it("can disable user", function () {
            //arange
            var user = {};

            //act
            service.setDeletedState(user);

            //assert
            expect(user.EntityState).toBe(entityState.Modified);
            expect(user.Disabled).toBe(true);
        });
    });
});
describe("Admin services - server service", function () {

    beforeEach(module("app"));

    describe("Server service test", function () {
        var service;
        var userRepository;

        beforeEach(inject(function ($injector) {
            service = $injector.get("serverService");
            userRepository = $injector.get("userRepository");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can read all users", function() {
            //arange
            var scope = {};
            userRepository.get = function() {
                var obj= {
                    then: function() {
                        scope.users = "test";
                    }
                }
                return obj;
            };

            //act
            service.readAllUsers(scope);

            //assert
            expect(scope.users).toBe("test");
        });

        it("can get user by login", function () {
            //arange
            var scope = {};
            userRepository.getByLogin = function(login) {
                var obj = {
                    then: function() {
                        scope.users = login;
                    }
                }
                return obj;
            };

            //act
            service.getUserByLogin(scope, "test");

            //assert
            expect(scope.users).toBe("test");
        });

        it("can manage user", function () {
            //arange
            var scope = {};
            userRepository.post = function (usersList) {
                var obj = {
                    then: function () {
                        scope.users = usersList;
                    }
                }
                return obj;
            };

            //act
            service.manageUser(scope, "test");

            //assert
            expect(scope.users).toBe("test");
        });
    });
});
describe("Admin services - user state controll service", function () {

    beforeEach(module("app"));

    describe("User state controll service test", function () {
        var service;
        var entityState;

        beforeEach(inject(function ($injector) {
            service = $injector.get("userStateControll");
            entityState = $injector.get("entityState");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return 'danger' if user is disabled", function() {
            //arange
            var user = {
                Disabled: true
            };

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe("danger");
        });

        it("will return 'warning' if user is modified", function () {
            //arange
            var user = {
                EntityState: entityState.Modified
            };

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe("warning");
        });

        it("will return 'succes' if user is added", function () {
            //arange
            var user = {
                EntityState: entityState.Added
            };

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe("success");
        });

        it("will return null if user isnt modified, added or disabled", function () {
            //arange
            var user = {};

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe(null);
        });
    });
});
describe("Admin services - validation service", function () {

    beforeEach(module("app"));

    describe("Validation service test", function () {
        var service,
            role;

        beforeEach(inject(function ($injector) {
            service = $injector.get("validationService");
            role = $injector.get("role");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        describe("can check user existing", function() {
            it("will return false if user exists", function () {
                //arange
                var users = [];
                var user1 = {
                    Login: "test"
                };

                users.push(user1);

                //act
                var actual = service.checkUserExisting(users, "test");

                //assert
                expect(actual).toBe(false);
            });

            it("will return true if user doesnt exists", function () {
                //arange
                var users = [];
                var user1 = {
                    Login: "notTest"
                };

                users.push(user1);

                //act
                var actual = service.checkUserExisting(users, "test");

                //assert
                expect(actual).toBe(true);
            });
        });

        describe("can check if users role is admin", function() {
            it("will return true if user is admin", function () {
                //arange
                var user = {
                    Login: "Admin",
                    Role: {
                        Name: "Admin"
                    }
                };

                //act
                var actual = service.checkIfAdmin(user);

                //assert
                expect(actual).toBe(true);
            });

            it("will return false if user is not admin", function () {
                //arange
                var user = {
                    Login: "Admin",
                    Role: {
                        Name: "NotAdmin"
                    }
                };

                //act
                var actual = service.checkIfAdmin(user);

                //assert
                expect(actual).toBe(false);
            });
        });
    });
});
describe("Common date formater", function () {
    beforeEach(module("app"));

    describe("dateFormater service", function() {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("dateFormater");
        }));

        it("exists", function() {
            expect(service).not.toBe(null);
            expect(service).not.toBe(undefined);
        });

        it("can formate date", function() {
            //arange
            var nonFormatedDate = "2015-03-20T01:35:18.167";
            var formatedDate = "20/03/2015 - 01:35:18";

            //act
            var actual = service.formateDate(nonFormatedDate);

            //assert
            expect(actual).toEqual(formatedDate);
        });
    });
});
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-mocks.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-animate.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/truncate.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-route.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-ui/ui-bootstrap.js" />
/// <reference path="../../Common/angular-md5.js" />

/// <reference path="../../../app.js" />
/// <reference path="../../../Common/enums/entityState.js" />
/// <reference path="../../../Common/directives/autoSize.js" />
describe("Operator controller - player controller", function () {
    var isModalCalled = false;
    var isBroadcastHubCalled = false;

    var mockDependencies = function () {
        module(function ($provide) {
            $provide.service("broadcastHub", function () {
                isBroadcastHubCalled = true;

                var that = this;

                that.server = {
                    mirrorText: function () { },
                    play: function () { },
                    handPlayBack: function () { },
                    handPlay: function () { },
                    pause: function () { },
                    stop: function () { },
                    speedUp: function () { },
                    speedDown: function () { },
                    padRight: function () { },
                    padLeft: function () { },
                    changeTextSize: function () { }
                };


                return that;
            });

            $provide.service("$modal", function () {
                this.open = function() {
                    isModalCalled = true;

                    return {
                        result: {
                            then: function() {}
                        }
                    };
                };
            });
        });
    };

    beforeEach(function () {
        module("app");
        mockDependencies();
    });

    afterEach(function() {
        isModalCalled = false;
        isBroadcastHubCalled = false;
    });

    describe("Player controller test", function () {
        var controller,
            $scope = {
                $parent: {
                    selectedScript: {
                        Sections: []
                    }
                }
            };

        beforeEach(inject(function ($injector, $controller) {
            controller = $controller("playerController",
            { $scope: $scope });
        }));

        it("controller exists", function () {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function () {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can open", function() {
            //arange
            //act
            $scope.open();

            //assert
            expect(isModalCalled).toBe(true);
        });

        it("can display text", function() {
            //arange
            var section = {
                Order: 1,
                Text: "test"
            };

            $scope.$parent.selectedScript.Sections.push(section);

            //act
            var actual = $scope.displayText();

            //assert
            expect(actual).toBe("\n[Section:1]\ntest\n");
        });

        it("can call mirror text on server side", function () {
            //arange
            //act
            $scope.mirrorText();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });

        it("can close player", function() {
            //arange
            var broadcastOperatorCalled = false;
            var scopeStopped = false;

            $scope.broadcastOperator = {
                successEndBroadcast: function() {
                    broadcastOperatorCalled = true;
                }
            }
            $scope.stop = function() {
                scopeStopped = true;
            }

            //act
            $scope.closePlayer();

            //assert
            expect($scope.isMirroredX).toBe(undefined);
            expect($scope.isMirroredY).toBe(undefined);
            expect($scope.speed).toBe(1);
            expect($scope.leftPadding).toBe(0);
            expect($scope.rightPadding).toBe(0);
            expect($scope.textSize).toBe(90);

            expect(broadcastOperatorCalled).toBe(true);
            expect(scopeStopped).toBe(true);
        });

        it("can dont save changes", function () {
            //arange
            var broadcastOperatorCalled = false;

            $scope.broadcastOperator = {
                successEndBroadcast: function () {
                    broadcastOperatorCalled = true;
                }
            }

            //act
            $scope.dontSaveChanges();

            //assert
            expect($scope.showDialog).toBe(false);
            expect($scope.textIsChanged).toBe(false);

            expect(broadcastOperatorCalled).toBe(true);
        });

        it("can save changes", function () {
            //arange
            var broadcastOperatorCalled = false;

            $scope.broadcastOperator = {
                successEndBroadcast: function () {
                    broadcastOperatorCalled = true;
                }
            }

            //act
            $scope.saveChanges();

            //assert
            expect($scope.showDialog).toBe(false);
            expect($scope.textIsChanged).toBe(false);

            expect(broadcastOperatorCalled).toBe(true);
        });

        it("can pause", function () {
            //arange
            //act
            $scope.pause();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
            expect($scope.isHandPlayDisabled).toBe(false);
            expect($scope.isPlayDisabled).toBe(false);
        });
        
        it("can speed up", function () {
            //arange
            $scope.speed = 0;

            //act
            $scope.speedUp();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
            expect($scope.speed).toBe(1);
        });

        it("can speed down", function () {
            //arange
            $scope.speed = 5;

            //act
            $scope.speedDown();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
            expect($scope.speed).toBe(4);
        });

        it("has getNextSection function, but it does nothing", function () {
            //arange
            //act
            $scope.getNextSection();

            //assert
        });

        it("has getPrevSection function, but it does nothing", function () {
            //arange
            //act
            $scope.getNextSection();

            //assert
        });

        it("can pad rigth", function () {
            //arange
            //act
            $scope.padRight();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });

        it("can pad left", function () {
            //arange
            //act
            $scope.padLeft();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });

        it("can change text size", function () {
            //arange
            //act
            $scope.changeTextSize();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });
    });
});
describe("userActivity caching service", function () {

    beforeEach(module("app"));

    describe("userActivityCachingService tests", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("userActivityCachingService");
        }));

        it("exists", function () {
            expect(service).not.toBe(null);
        });

        it("can add page to cache", function () {
            //arange
            var pageOne = "one";
            var pageTwo = "two";

            //act
            service.addPageToCache(pageOne);
            service.addPageToCache(pageTwo);

            //assert
            expect(service.getPageFromCache(1)).toBe(pageOne);
            expect(service.getPageFromCache(2)).toBe(pageTwo);
            expect(service.getPageFromCache(3)).toBe(undefined);
        });

        it("can check if pages is cached", function() {
            //arange
            var pageOne = "one";
            var pageTwo = "two";

            //act
            service.addPageToCache(pageOne);
            service.addPageToCache(pageTwo);

            //assert
            expect(service.isPageCached(1)).toBe(true);
            expect(service.isPageCached(2)).toBe(true);
            expect(service.isPageCached(3)).toBe(false);
        });

        it("can refresh cached page", function() {
            //arange
            var pageOne = "one";
            var newPageOne = "newOne";

            //act
            service.addPageToCache(pageOne);
            service.refreshCachePage(newPageOne, 1);

            //assert
            expect(service.getPageFromCache(1)).not.toBe(pageOne);
            expect(service.getPageFromCache(1)).toBe(newPageOne);
        });

        it("can clear cache", function() {
            //arange
            var pageOne = "one";
            var pageTwo = "two";

            //act
            service.addPageToCache(pageOne);
            service.addPageToCache(pageTwo);
            service.clearCache();

            //assert
            expect(service.isPageCached(1)).toBe(false);
            expect(service.isPageCached(2)).toBe(false);
            expect(service.getPageFromCache(1)).toBe(undefined);
            expect(service.getPageFromCache(2)).toBe(undefined);
        });
    });

});
describe("userActivity controller", function() {
    beforeEach(module("app"));

    describe("User activity conroller test", function() {
        var controller;
        var $scope;
        var $httpBackend;

        var createController = function ($controller) {
            $scope = {};
            controller = $controller("userActivityController",
                { $scope: $scope }
            );
        }

        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("GET", webApi.userActivity + "?page=1")
                            .respond("test get respond");
            $httpBackend.when("POST", webApi.userActivity)
                            .respond("test post respond");
            $httpBackend.when("DELETE", webApi.userActivity)
                            .respond("test clean respond");

            $httpBackend.when("GET", webApi.userActivityActivator)
                            .respond("test activity status respond");
            $httpBackend.when("POST", webApi.userActivityActivator
                + "?isUserActivityActivated=true")
                            .respond("test activity status changed respond");
        };

        beforeEach(inject(function ($injector, $controller) {
            createController($controller);
            mockHttpRequests($injector);
        }));

        it("exists", function() {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("can tell if any log avaible", function () {
            //arange
            $scope.currentPageLogs = [];

            $scope.currentPageLogs.push("log");

            //act
            var actual = $scope.isAnyLogAvaible();

            //assert
            expect(actual).toBe(false);
        });

        it("can change user activity tracking state", function() {
            //arange
            $scope.acceptActivityStatus = function () { };
            $scope.handleNewLogs = function() {};

            spyOn($scope, "acceptActivityStatus");

            //act
            $scope.changeTrackingState();

            $httpBackend.flush();

            //assert
            expect($scope.acceptActivityStatus).toHaveBeenCalled();
            expect($scope.acceptActivityStatus).toHaveBeenCalledWith("test activity status changed respond");
        });

        it("can get next user activity page", function () {
            //arange
            $scope.acceptActivityStatus = function () { };
            $scope.handleNewLogs = function() {};
            $scope.logPage = 0;

            spyOn($scope, "acceptNewLogs");

            //act
            $scope.getNextPage();

            $httpBackend.flush();

            //assert
            expect($scope.acceptNewLogs).toHaveBeenCalled();
            expect($scope.acceptNewLogs).toHaveBeenCalledWith("test get respond");
        });

        it("can get previous user activity page", function () {
            //arange
            $scope.acceptActivityStatus = function () { };
            $scope.handleNewLogs = function () { };
            $scope.logPage = 2;

            spyOn($scope, "acceptNewLogs");

            //act
            $scope.getPreviousPage();

            $httpBackend.flush();

            //assert
            expect($scope.acceptNewLogs).toHaveBeenCalled();
            expect($scope.acceptNewLogs).toHaveBeenCalledWith("test get respond");
        });

        it("can get next user activity page from cache", function () {
            //arange
            $scope.acceptActivityStatus = function () { };
            $scope.handleNewLogs = function () { };

            $scope.isPageCached = function() {
                return true;
            };

            $scope.logPage = 0;
            
            spyOn($scope, "getPageFromCache");

            //act
            $scope.getNextPage();

            $httpBackend.flush();

            //assert
            expect($scope.getPageFromCache).toHaveBeenCalled();
            expect($scope.getPageFromCache).toHaveBeenCalledWith(1);
        });

        it("can get previous user activity page from cache", function () {
            //arange
            $scope.acceptActivityStatus = function () { };
            $scope.handleNewLogs = function () { };

            $scope.isPageCached = function () {
                return true;
            };

            $scope.logPage = 2;

            spyOn($scope, "getPageFromCache");

            //act
            $scope.getPreviousPage();

            $httpBackend.flush();

            //assert
            expect($scope.getPageFromCache).toHaveBeenCalled();
            expect($scope.getPageFromCache).toHaveBeenCalledWith(1);
        });

        it("can refresh current log page", function() {
            //arange
            $scope.acceptActivityStatus = function () { };
            $scope.handleNewLogs = function() { };
            $scope.refreshCachePage = function () { };

            spyOn($scope, "handleNewLogs");
            spyOn($scope, "refreshCachePage");

            //act
            $scope.refreshCurrentPage();

            $httpBackend.flush();

            //assert
            expect($scope.handleNewLogs).toHaveBeenCalled();
            expect($scope.handleNewLogs).toHaveBeenCalledWith("test get respond");
            expect($scope.refreshCachePage).toHaveBeenCalled();
            expect($scope.refreshCachePage).toHaveBeenCalledWith(undefined, 1);
        });

        it("can clear all user actuvity history", function () {
            //arange
            $scope.acceptActivityStatus = function () { };
            $scope.handleNewLogs = function () { };
            $scope.refreshCurrentPage = function () { };
            $scope.disableNextPageButton = function () { };
            $scope.closeConfirmationWindow = function() {};

            spyOn($scope, "refreshCurrentPage");
            spyOn($scope, "disableNextPageButton");

            //act
            $scope.clearAllUserActivityHistory();

            $httpBackend.flush();

            //assert
            expect($scope.refreshCurrentPage).toHaveBeenCalled();
            expect($scope.disableNextPageButton).toHaveBeenCalled();
        });

        it("can will disable next button if logs count is less then 50", function () {
            //arange
            $scope.currentPageLogs = [];

            //act
            $scope.currentPageLogs.push("1");
            var disable = $scope.disableNextPageButton();

            for (var i = 0; i < 49; i++) {
                $scope.currentPageLogs.push("1");
            }
            var enable = $scope.disableNextPageButton();

            //assert
            expect(disable).toBe(true);
            expect(enable).toBe(false);
        });

        it("can will enable next button if logs count is 50", function () {
            //arange
            $scope.currentPageLogs = [];

            //act
            for (var i = 0; i < 50; i++) {
                $scope.currentPageLogs.push("1");
            }

            var enable = $scope.disableNextPageButton();

            //assert
            expect(enable).toBe(false);
        });

        it("will disable previous button if page number is 1", function () {
            //arange
            $scope.logPage = 1;

            //act
            var disable = $scope.disablePreviousPageButton();
            
            //assert
            expect(disable).toBe(true);
        });

        it("will not disable previous button if page number is greater than 1", function () {
            //arange
            $scope.logPage = 2;

            //act
            var enable = $scope.disablePreviousPageButton();

            //assert
            expect(enable).toBe(false);
        });

        it("can accept user activity status", function() {
            //arange
            var testStatus = "test";

            //act
            $scope.acceptActivityStatus(testStatus);

            //assert
            expect($scope.activityStatus).toBe(testStatus);
            expect($scope.isActivityStateChanging).toBe(false);
        });

        it("can accept new logs", function() {
            //arange
            var testLog = "test";

            $scope.handleNewLogs = function(logs) {
                return logs;
            }
            $scope.addPageToCache = function () { };

            spyOn($scope, "addPageToCache");

            //act
            $scope.acceptNewLogs(testLog);

            //assert
            expect($scope.currentPageLogs).toBe(testLog);

            expect($scope.addPageToCache).toHaveBeenCalled();
            expect($scope.addPageToCache).toHaveBeenCalledWith(testLog);
        });
    });
});
describe("userActivity repository", function () {
    beforeEach(module("app"));

    describe("User activity repository test", function () {
        var service;
        var $httpBackend, webApi;

        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("GET", webApi.userActivity + "?page=1")
                            .respond("test get respond");
            $httpBackend.when("POST", webApi.userActivity)
                            .respond("test post respond");
            $httpBackend.when("DELETE", webApi.userActivity)
                            .respond("test clean respond");

            $httpBackend.when("GET", webApi.userActivityActivator)
                            .respond("test activity status respond");
            $httpBackend.when("POST", webApi.userActivityActivator
                + "?isUserActivityActivated=true")
                            .respond("test activity status changed respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("userActivityRepository");
            mockHttpRequests($injector);
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("can get user activity pages", function() {
            //arange
            var actual;

            //act
            service.userActivity.get(1).then(
                function(logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test get respond");
        });

        it("can post user activity pages", function() {
            //arange
            var actual;

            //act
            service.userActivity.post().then(
                function(logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test post respond");
        });

        it("can clear user activity pages", function () {
            //arange
            var actual;

            //act
            service.userActivity.clearAllHistory().then(
                function (logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test clean respond");
        });

        it("can get user activity status", function () {
            //arange
            var actual;

            //act
            service.userActivityActivator.get().then(
                function (logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test activity status respond");
        });

        it("can change user activity status", function () {
            //arange
            var actual;

            //act
            service.userActivityActivator.post(true).then(
                function (logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test activity status changed respond");
        });
    });
});
describe("userActivity service", function() {
    beforeEach(module("app"));

    describe("userActivityService test", function() {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("userActivityService");
        }));

        it("exists", function() {
            expect(service).not.toBe(null);
            expect(service).not.toBe(undefined);
        });

        it("can formate user activity status", function() {
            //arange
            var statusOff = false;
            var statusOn = true;

            //act
            var formatedStatusOff = service.getUserActivityStatus(statusOff);
            var formatedStatusOn = service.getUserActivityStatus(statusOn);

            //assert
            expect(formatedStatusOff).toBe("off");
            expect(formatedStatusOn).toBe("on");
        });

        it("can handle new logs", function() {
            //arange
            var incomingLogs = [];
            var log = {};

            incomingLogs.push(log);
            incomingLogs.push(log);

            service.handleNewLogs = function() {};

            spyOn(service, "handleNewLogs");

            //act
            var formatedLogs = service.handleNewLogs(incomingLogs);

            //assert
            expect(service.handleNewLogs).toHaveBeenCalled();
        });

        it("cals error notification", function () {
            //arange
            service.errorNotification = function() {}

            spyOn(service, "errorNotification");

            //act
            service.errorNotification("test");

            //assert
            expect(service.errorNotification).toHaveBeenCalled();
            expect(service.errorNotification).toHaveBeenCalledWith("test");
        });
    });
});
describe("Operator services - operator dialog service", function () {

    beforeEach(module("app"));

    describe("Operator dialog operator service test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("operatorDialog");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can set showScriptModal var to true", function() {
            //arange
            var scope = {};

            //act
            service(scope).script();

            //assert
            expect(scope.showScriptModal).toBe(true);
        });

        it("can set showImport var to true", function () {
            //arange
            var scope = {};

            //act
            service(scope).import();

            //assert
            expect(scope.showImport).toBe(true);
        });
    });
});
describe("Operator services - prompter checked service", function () {

    beforeEach(module("app"));

    describe("Prompter checked operator service test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterChecked");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can set prompter checked to true", function() {
            //arange
            var prompter = {};

            //act
            service(prompter);

            //assert
            expect(prompter.checked).toBe(undefined);
        });
    });
});
describe("Operator services - prompter class service", function () {

    beforeEach(module("app"));

    describe("Prompter class operator service test", function () {
        var service,
            prompterStatus,
            listGroupItem;


        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterClass");
            prompterStatus = $injector.get("prompterStatus");
            listGroupItem = $injector.get("listGroupItem");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return 'success' if prompter status is 'On'", function() {
            //arange
            var prompter = {
                PrompterStatus: prompterStatus.On
            }

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(listGroupItem.success);
        });

        it("will return 'warning' if prompter status is 'Busy'", function () {
            //arange
            var prompter = {
                PrompterStatus: prompterStatus.Busy
            }

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(listGroupItem.warning);
        });

        it("will return 'none' in all other cases", function () {
            //arange
            var prompter = {}

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(listGroupItem.none);
        });
    });
});
describe("Operator services - prompter order service", function () {

    beforeEach(module("app"));

    describe("Prompter order operator service test", function () {
        var service,
            prompterStatus;

        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterOrder");
            prompterStatus = $injector.get("prompterStatus");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return prompters status order", function() {
            //arange
            var prompter = {
                PrompterStatus: prompterStatus.On
            };

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(1);
        });
    });
});
describe("Operator services - prompter repository service", function () {

    beforeEach(module("app"));

    describe("Prompter repository operator service test", function () {
        var service,
            webApi,
            $httpBackend;

        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("GET", webApi.prompter)
                .respond("test get respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterRepository");
            webApi = $injector.get("webApi");

            mockHttpRequests($injector);
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can send get http request", function() {
            //arange
            var actual;

            //act
            service.get()
                .then(function() {
                    actual = true;
                });

            $httpBackend.flush();

            //assert
            expect(actual).toBe(true);
        });
    });
});
describe("Operator services - can play service", function () {

    beforeEach(module("app"));

    describe("Can play operator service test", function () {
        var service,
            prompterStatus;

        beforeEach(inject(function ($injector) {
            service = $injector.get("canPlay");
            prompterStatus = $injector.get("prompterStatus");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can tell if we can play script", function() {
            //arange
            var scope = {
                selectedScript: "test"
            };
            var prompter = {
                PrompterStatus: prompterStatus.On
            };

            //act
            var actual = service(scope)(prompter);

            //assert
            expect(actual).toBe(true);
        });
    });
});
describe("Operator services - script class service", function () {

    beforeEach(module("app"));

    describe("Script class operator service test", function () {
        var service,
            entityState,
            listGroupItem;

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptClass");
            entityState = $injector.get("entityState");
            listGroupItem = $injector.get("listGroupItem");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return list 'info' if script is selected", function() {
            //arange
            var script = {
                EntityState: entityState.Modified
            };
            var scope = {
                selectedScript: script
            };

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.info);
        });

        it("will return list 'warning' if scripts entity state is Modified", function () {
            //arange
            var script = {
                EntityState: entityState.Modified
            };
            var scope = {};

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.warning);
        });

        it("will return list 'success' if scripts entity state is Added", function () {
            //arange
            var script = {
                EntityState: entityState.Added
            };
            var scope = {};

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.success);
        });

        it("will return list 'empty' in all other cases", function () {
            //arange
            var script = {};
            var scope = {};

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.empty);
        });
    });
});
describe("Operator services - script order service", function () {

    beforeEach(module("app"));

    describe("Script order operator service test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptOrder");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can return script title", function() {
            //arange
            var script = {
                Title: "Test"
            };

            //act
            var actual = service(script);

            //assert
            expect(actual).toBe("Test");
        });
    });
});
describe("Operator services - script repository service", function () {

    beforeEach(module("app"));

    describe("Script repository operator service test", function () {
        var service,
            webApi,
            $httpBackend;

        var mockHttpRequests = function($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("GET", webApi.script)
                .respond("test get respond");
            $httpBackend.when("POST", webApi.script)
                .respond("test post respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptRepository");
            webApi = $injector.get("webApi");

            mockHttpRequests($injector);
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can send get http requst to script controller", function() {
            //arange
            var actual;

            //act
            service.get()
                .then(function(response) {
                    actual = response;
                });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test get respond");
        });

        it("can send post http requst to script controller", function () {
            //arange
            var actual;
            var scripts = {};

            //act
            service.post(scripts)
                .then(function (response) {
                    actual = response;
                });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test post respond");
        });
    });
});
describe("Operator services - script service service", function () {
    var isFileUploadCalled = false;

    var mockDependencies = function() {
        module(function($provide) {
            $provide.service("fileUpload", function () {
                isFileUploadCalled = true;

                return function() {};
            });
            $provide.service("notify", function () {
                return function () { };
            });
        });
    };

    beforeEach(function() {
        module("app");
        mockDependencies();
    });

    afterEach(function() {
        isFileUploadCalled = false;
    })

    describe("Script service operator service test", function () {
        var service,
            constants,
            entityState,
            prompterStatus,
            $httpBackend,
            webApi;

        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("POST", webApi.scripts)
                            .respond("test post respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptService");
            constants = $injector.get("constants");
            entityState = $injector.get("entityState");
            prompterStatus = $injector.get("prompterStatus");

            mockHttpRequests($injector);
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can add", function() {
            //arange
            var scope = {
                scripts: [],
                newScriptName: "Test",
                newScriptDescription: "Test description"
            };
            var form = {
                $valid: true
            };

            //act
            service(scope).add(form);

            //assert
            expect(scope.scripts.length).toBe(1);
            expect(scope.newScriptName).toBe(constants.scriptDefaultName);
            expect(scope.newScriptDescription).toBe(constants.emptyString);
            expect(scope.showScriptModal).toBe(false);
        });

        describe("can remove", function() {
            it("will null if script is selected script", function () {
                //arange
                var script = "test";
                var scope = {
                    selectedScript: script
                };

                //act
                service(scope).remove(script);

                //assert
                expect(scope.selectedScript).toBe(null);
            });

            it("will splice if scripts entity state is added", function () {
                //arange
                var script = {
                    EntityState: entityState.Added
                };
                var scope = {
                    scripts: []
                };

                scope.scripts.push(script);

                //act
                service(scope).remove(script);

                //assert
                expect(scope.scripts.length).toBe(0);
            });

            it("will mark script and all sections as deleted if script is not added", function () {
                //arange
                var section = {
                    EntityState: entityState.Added
                };
                var script = {
                    EntityState: entityState.Modified,
                    Sections: [],
                    Options: {}
                };
                var scope = {};

                script.Sections.push(section);
                
                //act
                service(scope).remove(script);

                //assert
                expect(script.EntityState).toBe(entityState.Deleted);
                expect(script.Sections[0].EntityState).toBe(entityState.Deleted);
                expect(script.Options.EntityState).toBe(entityState.Deleted);
            });
        });

        it("can select script", function() {
            //arange
            var scope = {};
            var script = "test";

            //act
            service(scope).select(script);

            //assert
            expect(scope.selectedScript).toBe("test");
        });

        it("can save script", function () {
            //arange
            var scope = {
                scripts: []
            };
            var script = {
                EntityState: entityState.Modified,
                Sections: []
            };
            var section = {};

            scope.scripts.push(script);
            scope.scripts[0].Sections.push(section);

            //act
            service(scope).save(script);

            $httpBackend.flush();

            //assert
            expect(scope.scripts).toBe("test post respond");
            expect(scope.selectedScript).toBe(null);
        });

        describe("import method", function() {
            it("can import pptx files", function () {
                //arange
                var scope = {
                    scriptFile: "test.pptx"
                };

                //act
                service(scope).import();

                //assert
                expect(isFileUploadCalled).toBe(true);
            });

            it("can import txt files", function () {
                //arange
                var scope = {
                    scriptFile: "test.txt"
                };

                //act
                service(scope).import();

                //assert
                expect(isFileUploadCalled).toBe(true);
            });
        });

        it("can init script", function() {
            //arange
            var scope = {
                scripts: []
            };
            var script = {
                Title: "Test"
            };
            var secondScript = {
                Title: "Z"
            };

            scope.scripts.push(secondScript);
            scope.scripts.push(script);

            //act
            service(scope).initScript(script);

            //assert
            expect(scope.index).toBe(0);
        });

        describe("check method", function() {
            it("will splice checked prompters from check list", function () {
                //arange
                var prompter = {
                    checked: true
                };
                var scope = {
                    checked: []
                };

                scope.checked.push(prompter);

                //act
                service(scope).check(prompter);

                //assert
                expect(prompter.checked).toBe(false);
                expect(scope.checked.length).toBe(0);
            });

            it("will add prompter to checked array if he is on", function() {
                //arange
                var prompter = {
                    checked: false,
                    PrompterStatus: prompterStatus.On
                };
                var scope = {
                    checked: []
                };

                //act
                service(scope).check(prompter);

                //assert
                expect(prompter.checked).toBe(true);
                expect(scope.checked.length).toBe(1);
            });
        });

        it("can check!?", function() {
            //arange
            var scope = {};
            var prompter = {
                PrompterStatus: prompterStatus.On
            }

            //act
            var actual = service(scope).canCheck(prompter);

            //assert
            expect(actual).toBe(true);
        });
    });
});
describe("Operator sections", function () {

    beforeEach(module("app"));

    describe("manageSections test", function() {
        var service;
        var entityState;

        beforeEach(inject(function ($injector) {
            service = $injector.get("manageSections");
            entityState = $injector.get("entityState");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can init new sections", function() {
            //arange
            var section = [];
            var newSection = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Added
            };

            //act
            service.initNewSection(section);

            //assert
            expect(section[0]).toEqual(newSection);
        });

        it("will delete sections that are already exists in database, by changing entityState to Deleted", function () {
            //arange
            var dummyScript = {};
            var section = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Modified
            };

            //act
            service.deleteSection(section, dummyScript);

            //assert
            expect(section.EntityState).toBe(entityState.Deleted);
        });

        it("will delete sections that arent exists in database, by splicing them from array", function () {
            //arange
            var script = {};
            script.Sections = [];
            var section = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Added
            };

            script.Sections.push(section);

            //act
            service.deleteSection(section, script);

            //assert
            expect(script.Sections.length).toBe(0);
        });

        it("will change script state to modify if we delete any section", function () {
            //arange
            var script = {};
            script.Sections = [];
            var section = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Added
            };

            script.Sections.push(section);

            //act
            service.deleteSection(section, script);

            //assert
            expect(script.EntityState).toBe(entityState.Modified);
        });

        it("can check if section is deleted", function () {
            //arange
            var section = {
                EntityState: entityState.Deleted
            };

            //act
            var actual = service.isDeleted(section);

            //assert
            expect(actual).toBe(false);
        });

        it("will update section and script state to modify, if section is not new or modified", function () {
            //arange
            var script = {};
            var section = {
                EntityState: entityState.Deleted
            };

            //act
            service.updateSectionState(section, script);

            //assert
            expect(section.EntityState).toBe(entityState.Modified);
            expect(script.EntityState).toBe(entityState.Modified);
        });

        it("will not update section state to, if script is undefined", function () {
            //arange
            var script = undefined;
            var section = {
                EntityState: entityState.Deleted
            };

            //act
            service.updateSectionState(section, script);

            //assert
            expect(section.EntityState).toBe(entityState.Deleted);
        });
    });
});
describe("Operator sections services", function() {

    beforeEach(module("app"));

    describe("Section services test", function() {
        var service;
        var constants;

        beforeEach(inject(function($injector) {
            service = $injector.get("sectionServices");
            constants = $injector.get("constants");
        }));

        it("exist", function() {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can display section intro", function() {
            //arange
            var section = {
                Text: "Some long test text to test"
            };
            //+3 is because if text is longer then sectionsIntroLength it will concat with "..."
            //+1 is because jasmine supports only LessThen, and not LessOrEqualThen
            var readTextLength = constants.sectionsIntroLength + 3 + 1;

            //act
            var actual = service.displaySectionIntro(section);

            //assert
            expect(actual.length).toBeLessThan(readTextLength);
        });
    });
});