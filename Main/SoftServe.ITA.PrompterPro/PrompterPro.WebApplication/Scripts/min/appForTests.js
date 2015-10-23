(function() {
    var getCurrentDateTime = function () {
        var currentdate = new Date();
        var dateTime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                     + currentdate.getDate() + " "
                     + currentdate.getHours() + ":"
                     + currentdate.getMinutes() + ":"
                     + currentdate.getSeconds();
        return dateTime;
    }

    var logError = function (error) {
        $.ajax({
            type: 'POST',
            url: '/api/diagnostics',
            contentType: 'application/json; charset=UTF-8',
            data: angular.toJson({
                ExceptionName: error.name || error,
                Message: error.stack || "",
                Date: getCurrentDateTime()
            })
        });
    }

    window.onerror = function (error) {
        logError(error);
    }
})();
app.factory("constants", function () {
	return Object.freeze({
		tagScript			: "<Script>",
		tagSection			: "<Section>",
		tagDescription		: "<Description>",

        SECTION_SPLITTER    : "\n\n",
        scriptDefaultName   : "Script",
        imported            : "Successfully imported: ",
		invalidFormat		: "This file format is not supported.",
        unimported          : "Errors occured while importing. Please try again later.",
        emptyString         : "",
        noPendingChanges    : "No pending changes",
        successfulChanges   : " change(s) saved!",
        changesSaved        : "Changes successfully saved",
        cnagesUnsaved       : "Errors occured while saving changes. Please try again later.",
        changesSavig        : "Saving changes...",

        connectSucces		: "Successfully connected with all prompters.",
        cantConnect			: "Errors occured while connecting with prompters. Please try again later.",
        connectedToOperator : "Successfully connected to operator. Waiting for others to connect.",
        allConnected        : "All prompters successfully connected. Broadcast started.",
    	broadcastEnd		: "Broadcast session was ended by operator.",
    	operatorDisconnected: "Broadcast failed. Operator disconnected.",
		lostConnectionWith  : "Lost connection with ",
		allDisconnected		: "All prompters disconnected. Session ended.",

		broadcastTimeout	: 60000,

        sectionsIntroLength : 25,

        defaultFontSize     : 10,
        defaultReadingSpeed : 10,
        defaultAnnouncer: "Default",

        diagnositcsMessageDisplayLength: 100,
        usrerWithSameName: 'User with that name already exists',
        cantDeleteAdmin : 'You cant delete Admin'

    });
});

app.factory("icons", function () {
    return Object.freeze({
        ok: "glyphicon glyphicon-ok",
        info: "glyphicon glyphicon-info-sign",
        warning: "glyphicon glyphicon-warning-sign"
    });
});

app.factory("webApi", function () {
    return Object.freeze({
        presentation            : "/api/presentation",
        script                  : "/api/script",
        prompter                : "/api/prompter",
        diagnostics             : "/api/diagnostics",
        userActivity            : "/api/userActivity",
        userActivityActivator   : "/api/userActivityActivator"
    });
});

app.controller("prompterController", [
    "$scope",
    "prompterService",
    function ($scope, prompterService) {
        $("div.container.body-content")
            .removeClass("container body-content")
            .addClass("container-full");

        var black = "rgb(0, 0, 0)";
        $("body")
            .css("background-color", black)
            .keyup(function (event) {
            var code = (event.keyCode ? event.keyCode : event.which);
            if (code === 122) {
                $("div.navbar.navbar-inverseNew.navbar-fixed-top").toggleClass("ng-hide");
            }
        });
        $scope.service = prompterService($scope);
    }
]);
app.factory("prompterRepository", [
    "$http",
    function ($http) {
        var obj = {};

        obj.get = function (id, callback) {
            var url = "api/script/" + String(id);

            $http.get(url)
                .success(function(response) {
	            callback(response);
            });
        };

        return obj;
    }
]);

app.service("prompterService",
[
    "broadcastHub",
    "prompterRepository",
	"constants",
    "notify",
    "notifyType",
    "icons",
    "prompterResolution",
    function (
        broadcastHub,
        prompterRepository,
		constants,
		notify,
		notifyType,
		icons,
        prompterResolution) {

    	return function ($scope) {

    	    var textBox = $('#area');
    	    var animation;
    	    var maxSpeed = 10;
    	    var minSpeed = 1;
    	    var velocity = 15;
	        var resolutionMultiplier = 1;
    	    $scope.textIsChanged = false;
    	    $scope.textSizes = [50, 55, 60, 70, 80, 90, 100, 110, 130];
    	    $scope.showDialog = false;
    	    $scope.speed = 1;
    	    $scope.currentSize = $scope.textSizes[2];
    	    $scope.textSize = 90;
    	    $scope.leftPadding = 0;
    	    $scope.rightPadding = 0;

		    $scope.hub = broadcastHub;
		    function setDefaultProps() {
		        $scope.isMirroredX = undefined;
		        $scope.isMorroredY = undefined;
		        $scope.speed = 1;
		        $scope.leftPadding = 0;
		        $scope.rightPadding = 0;
		        $scope.textSize = 90;
		        broadcastHub.client.stop();
		    }
		    broadcastHub.client.fetchScript = function (scriptId, operatorId) {
                prompterRepository.get(scriptId, function(script) {
                    $scope.script = script;
                    broadcastHub.server.fetchSuccess(operatorId);
                    notify(
						notifyType.success,
						constants.connectedToOperator,
						icons.ok);
                    $scope.$apply();
                });
            }

		    broadcastHub.client.operatorConnected = function () {
		    	notify(
					notifyType.success,
					constants.allConnected,
					icons.ok);
		    	$scope.$apply();
            }


		    broadcastHub.client.broadcastEnd = function () {
		    	notify(
					notifyType.success,
					constants.broadcastEnd,
					icons.warning);
		    	$scope.script = null;
		        setDefaultProps();
		    	$scope.$apply();
		    }

		    broadcastHub.client.operatorDisconnected = function () {
		    	notify(
					notifyType.danger,
					constants.operatorDisconnected,
					icons.warning);
		    	$scope.script = null;
		    	setDefaultProps();
		    	$scope.$apply();
		    }

            broadcastHub.client.play = function () {
		        animation = setInterval(function () {
		            if (textBox.scrollTop() <= textBox.get(0).scrollHeight) {
		                textBox.scrollTop(textBox.scrollTop() + $scope.speed);
		            }
		        }, velocity);
		    }

		    broadcastHub.client.pause = function () {
                clearInterval(animation);
            }

		    broadcastHub.client.stop = function () {
                clearInterval(animation);
                textBox.scrollTop(0);
            }

		    broadcastHub.client.changeTextSize = function (size) {
		        $scope.textSize = size;
		        $scope.$apply();
            }

            broadcastHub.client.speedUp = function() {
                if ($scope.speed < maxSpeed) {
                    $scope.speed++;
                }
            }

            broadcastHub.client.speedDown = function() {
                if ($scope.speed > minSpeed) {
                    $scope.speed--;
                }
            }

            broadcastHub.client.mirrorText = function (isMirroredX, isMirroredY) {
                if (isMirroredX && isMirroredY) {
                    textBox.css({ 'transform': 'matrix(-1, 0, 0, -1, 0, 0)' });
                }
                if (isMirroredX && !isMirroredY) {
                    textBox.css({ 'transform': 'matrix(-1, 0, 0, 1, 0, 0)' });
                }
                if (!isMirroredX && isMirroredY) {
                    textBox.css({ 'transform': 'matrix(1, 0, 0, -1, 0, 0)' });
                }
                if (!isMirroredX && !isMirroredY) {
                    textBox.css({ 'transform': 'matrix(1, 0, 0, 1, 0, 0)' });
                }
            }
            
            broadcastHub.client.handPlayBack = function () {
                broadcastHub.client.pause();
                animation = setInterval(function () {
                    if (textBox.scrollTop() > 0) {
                        textBox.scrollTop(textBox.scrollTop() - $scope.speed);
                    }
                }, velocity);
            }

            broadcastHub.client.handPlay = function () {
                broadcastHub.client.pause();
                animation = setInterval(function () {
                    if (textBox.scrollTop() <= textBox.get(0).scrollHeight) {
                        textBox.scrollTop(textBox.scrollTop() + $scope.speed);
                    }
                }, velocity);
            }

            broadcastHub.client.clearText = function () {
                document.getElementById("area").value = "";
            }
            
            $scope.displayText = function () {
                var text = '\n\n';
                var sections = $scope.script.Sections;
                _.each(sections, function (section) {
                    text += '[Section:' + section.Order + ']\n' + section.Text + '\n';
                });
                return text;
            }

            broadcastHub.client.padLeft = function(percentage) {
                $scope.leftPadding = percentage;
                $scope.$apply();
            }

            broadcastHub.client.padRight = function(percentage) {
                $scope.rightPadding = percentage;
                $scope.$apply();
            }

            broadcastHub.client.setResolution = function(resolution) {
                if (resolution == prompterResolution.Small) {
                    document.getElementById("area").width = 600;
                    resolutionMultiplier = 1;
                    broadcastHub.client.changeTextSize($scope.currentSize * resolutionMultiplier);
                }
                if (resolution == prompterResolution.Medium) {
                    document.getElementById("area").width = 800;
                    resolutionMultiplier = 1.5;
                    broadcastHub.client.changeTextSize($scope.currentSize * resolutionMultiplier);
                }
                if (resolution == prompterResolution.Large) {
                    document.getElementById("area").width = 1200;
                    resolutionMultiplier = 2;
                    broadcastHub.client.changeTextSize($scope.currentSize * resolutionMultiplier);
                }
            }

	        var obj = {};
	        return obj;
        };
    }
]);
app.directive('switch', function () {
    return {
        restrict: 'AE'
    , replace: true
    , transclude: true
    , template: function (element, attrs) {
        var html = '';
        html += '<span';
        html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
        html += attrs.ngModel ? ' ng-click="' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
        html += ' ng-class="{ checked:' + attrs.ngModel + ' }"';
        html += '>';
        html += '<small></small>';
        html += '<input type="checkbox"';
        html += attrs.id ? ' id="' + attrs.id + '"' : '';
        html += attrs.name ? ' name="' + attrs.name + '"' : '';
        html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
        html += ' style="display:none" />';
        html += '</span>';
        return html;
    }
    }
});

app.controller('adminController', [
    '$scope', function($scope) {

        $scope.isUsersTabActive = false;
        $scope.isDiagnosticsTabActive = false;
        $scope.isHistoryTabActive = false;

        

        $scope.makeUserTab = function() {
            $scope.isUsersTabActive = true;
            $scope.isDiagnosticsTabActive = false;
            $scope.isHistoryTabActive = false;
        };
        $scope.makeDiagnosticsTab = function() {
            $scope.isUsersTabActive = false;
            $scope.isDiagnosticsTabActive = true;
            $scope.isHistoryTabActive = false;
        };
        $scope.makeHistoryTab = function () {
            $scope.isUsersTabActive = false;
            $scope.isDiagnosticsTabActive = false;
            $scope.isHistoryTabActive = true;
        };

        $scope.autoClick = function(name) {
            var elem = document.getElementById(name.toString());
            elem.click();
        };
    }
]);


app.controller("datepickerController", [
    "$scope",
    "diagnosticsService",
    "dateFormater",
    function ($scope,
        diagnosticsService,
        dateFormater) {
        
        $scope.lastPeriod = function () {
            $scope.dt = new Date().setDate(new Date().getDate() - 7);
        };
        $scope.lastPeriod();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.today = new Date();


        $scope.$watch(function () {
            return $scope.dt;
        },
        function (fromDate) {
            if (fromDate) {
                var date = new Date(fromDate);
                var dString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                diagnosticsService.getFromDate(dString)
                    .then(function (diagnostics) {
                        $scope.$parent.diagnostics = diagnostics;
                        _.each(diagnostics, function (diagnostic) {
                            diagnostic.Date = dateFormater.formateDate(diagnostic.Date);
                        });
                    });
            }
        });

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            startingDay: 1
        };

        $scope.format = 'yyyy-MM-dd';
    }]);
app.controller("diagnosticsController", [
    "$scope",
    "diagnosticsService",
    "dateFormater",
    "$modal",
    "constants",
    function ($scope,
        diagnosticsService,
        dateFormater,
        $modal,
        constants) {

        diagnosticsService.getLastDiagnostics()
            .then(function (diagnostics) {
                $scope.diagnostics = diagnostics;
                _.each(diagnostics, function (diagnostic) {
                    diagnostic.Date = dateFormater.formateDate(diagnostic.Date);
                });
            });

        $scope.messageDisplayLength = constants.diagnositcsMessageDisplayLength;

        $scope.openMessageModal = function (diagnostic) {
            if (diagnostic.Message.length > constants.diagnositcsMessageDisplayLength) {
                var modalInstance = $modal.open({
                    templateUrl: 'fullMessageModal.html',
                    controller: 'diagnosticsMessageModalController',
                    resolve: {
                        diagnostic: function () {
                            return diagnostic;
                        }
                    }
                });
            }
        }
    }
]);
app.controller('diagnosticsMessageModalController',
    ['$scope', '$modalInstance', 'diagnostic',
        function ($scope, $modalInstance, diagnostic) {
    $scope.name = diagnostic.ExceptionName;
    $scope.message = diagnostic.Message;
    $scope.close = function () {
        $modalInstance.dismiss('close');
    };
}]);
app.controller('modalEditInstanceController',
    [ '$scope', '$modalInstance','userForEditing',
    function ($scope, $modalInstance, userForEditing) {

    $scope.userForEditing = userForEditing;

    $scope.ok = function () {
        $modalInstance.close($scope.userForEditing);
    };

    $scope.cancel = function () {
        $modalInstance.close($scope.copy);
    };
}]);
//app.controller('modalAddInstanceController',
//    ['$scope', '$modalInstance','newUser',
//        function ($scope, $modalInstance, newUser) {

//    $scope.newUser = angular.clone(newUser);
    
//    $scope.ok = function () {
//        $modalInstance.close($scope.newUser);
//    };

//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };
//}]);
app.controller('modalAddInstanceController',
    ['$scope', '$modalInstance', 'newUser',
    function ($scope, $modalInstance, newUser) {

    $scope.newUser = newUser;
    
    $scope.ok = function () {
        $modalInstance.close($scope.newUser);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller("userActivityController", [
    "$scope",
    "userActivityService",
    "userActivityRepository",
    "userActivityCachingService",
    function ($scope,
        userActivityService,
        userActivityRepository,
        userActivityCachingService) {

        $scope.activityStatus = false;
        $scope.isLoadingInProcess = true;
        $scope.logPage = 1;
        $scope.logsPerPage = 50;
        $scope.isActivityStateChanging = true;


        $scope.cachedLogs = new Array();
        $scope.currentPageLogs = undefined;

        $scope.dateFormatter = userActivityService.dateFormatter;
        $scope.formatUserActivityStatus = userActivityService.getUserActivityStatus;
        $scope.errorNotification = userActivityService.errorNotification;
        $scope.handleNewLogs = userActivityService.handleNewLogs;

        $scope.addPageToCache = userActivityCachingService.addPageToCache;
        $scope.isPageCached = userActivityCachingService.isPageCached;
        $scope.getPageFromCache = userActivityCachingService.getPageFromCache;
        $scope.refreshCachePage = userActivityCachingService.refreshCachePage;

        userActivityCachingService.clearCache();

        $scope.openConfirmationWindow = function () {
            $("#confirmationModal").modal("show");
        }

        $scope.closeConfirmationWindow = function () {
            $("#confirmationModal").modal("hide");
        }

        $scope.isAnyLogAvaible = function () {
            return $scope.currentPageLogs.length === 0;
        };

        $scope.clearAllUserActivityHistory = function () {
            userActivityRepository.userActivity
                .clearAllHistory()
                .then(
                    function () {
                        $scope.cachedLogs = new Array();
                        $scope.refreshCurrentPage();
                        $scope.isAnyLogAvaible = $scope.disableNextPageButton();
                    },
                    function () {
                        $scope.errorNotification("failed to clear user activity history.");
                    });
            $scope.closeConfirmationWindow();
        }

        $scope.acceptActivityStatus = function (isUserAtivityActivated) {
            $scope.activityStatus = isUserAtivityActivated;
            $scope.isActivityStateChanging = false;
        }

        $scope.disablePreviousPageButton = function () {
            return $scope.logPage === 1;
        }

        $scope.disableNextPageButton = function () {
            if ($scope.currentPageLogs !== undefined) {
                return $scope.currentPageLogs.length % $scope.logsPerPage !== 0
                    || $scope.currentPageLogs.length === 0;
            }
            return false;
        }

        $scope.refreshCurrentPage = function () {
            $scope.isLoadingInProcess = true;

            userActivityRepository.userActivity
                .get($scope.logPage)
                .then(
                    function (logs) {
                        $scope.currentPageLogs = $scope.handleNewLogs(logs);
                        $scope.refreshCachePage($scope.currentPageLogs, $scope.logPage);
                        $scope.isLoadingInProcess = false;
                    },
                    function () {
                        $scope.errorNotification("failed to refresh current page.");
                        $scope.isLoadingInProcess = false;
                    }
                );
        }

        $scope.acceptNewLogs = function (logs) {
            $scope.currentPageLogs = $scope.handleNewLogs(logs);
            $scope.addPageToCache($scope.currentPageLogs);
            $scope.isLoadingInProcess = false;
        }

        userActivityRepository.userActivity
            .get(1)
            .then(
                $scope.acceptNewLogs,
                function () {
                    $scope.errorNotification("failed to load user activity logs");
                    $scope.isLoadingInProcess = false;
                }
            );

        userActivityRepository.userActivityActivator
            .get()
            .then(
                $scope.acceptActivityStatus,
                function () {
                    $scope.errorNotification("failed to load user activity logging state.");
                    $scope.isActivityStateChanging = false;
                }
            );

        $scope.changeTrackingState = function () {
            $scope.isActivityStateChanging = true;

            userActivityRepository.userActivityActivator
                .post(!$scope.activityStatus)
                .then(
                    $scope.acceptActivityStatus,
                    function () {
                        $scope.errorNotification("failed to change user activity logging state.");
                        $scope.isActivityStateChanging = false;
                    }
                );
        }

        $scope.getNextPage = function () {
            $scope.logPage++;

            if ($scope.isPageCached($scope.logPage)) {
                $scope.currentPageLogs = $scope.getPageFromCache($scope.logPage);
                return;
            }

            $scope.isLoadingInProcess = true;

            userActivityRepository.userActivity
                .get($scope.logPage)
                .then(
                    $scope.acceptNewLogs,
                    function () {
                        $scope.errorNotification("failed to get next page.");
                        $scope.currentPageLogs = [];
                        $scope.isLoadingInProcess = false;
                    }
                );
        }

        $scope.getPreviousPage = function () {
            $scope.logPage--;

            if ($scope.isPageCached($scope.logPage)) {
                $scope.currentPageLogs = $scope.getPageFromCache($scope.logPage);
                return;
            }

            $scope.isLoadingInProcess = true;

            userActivityRepository.userActivity
                .get($scope.logPage)
                .then(
                    $scope.acceptNewLogs,
                    function () {
                        $scope.errorNotification("failed to load previous page.");
                        $scope.currentPageLogs = [];
                        $scope.isLoadingInProcess = false;
                    }
                );
        }
    }
]);
app.controller('usersController', [
    '$scope', '$modal', '$log','userRepository', 'serverService',
    'dialogSevice', 'entityState', 'role', 'manageListOfUsers',
    'manageUserSate', 'notify', 'notifyType',
    'icons', 'constants', 'userStateControll','validationService',
    function ($scope, $modal, $log, userRepository, serverService, dialogSevice,
        entityState, role, manageListOfUsers, manageUserSate, notify,
        notifyType, icons, constants, userStateControll, validationService) {

        $scope.showOkRemove = false;
        $scope.showEditDelete = true;
        $scope.showOddAndEven = true;
        $scope.showPrompterStatus = false;
        $scope.isEdited = false;
        $scope.isDeleted = false;
        $scope.managedUserslist = new Array();

        
        $scope.setIsDeleted = function() {
            $scope.isDeleted = true;
        };

        $scope.setIsEdited = function(value) {
            $scope.isEdited = value;
        };

        $scope.setShowOddAndEven = function(value) {
            $scope.showOddAndEven = value;
        };
        $scope.setShowPrompterStatus = function (value) {
            $scope.showPrompterStatus = value;
        };

        $scope.setShowEditDelete = function (value) {
            $scope.showEditDelete = value;
        };

        $scope.setShowOkRemove = function (value) {
            $scope.showOkRemove = value;
        };

        $scope.showPromStatus = function (name) {
            if (name === role.Prompter.Name) {
                $scope.showPrompterStatus = true;
            } else {
                $scope.showPrompterStatus = false;
            }
        };

        
        $scope.setUpdatedState = function(user) {
            manageUserSate.setModifiedState(user);
        };

        $scope.setDeletedState = function (user) {
            manageUserSate.setDeletedState(user);
        };

        $scope.setAddedState = function (user) {
            $scope.users.push(user);
            manageUserSate.setAddedState(user);
        }

        
        $scope.deleteCurrentUser = function (user) {
            if (!validationService.checkIfAdmin(user)) {
                if ($scope.managedUserslist.indexOf(user) !== -1 &&
                    $scope.managedUserslist[$scope.managedUserslist.indexOf(user)]
                    .EntityState === entityState.Added) {
                    $scope.removeFromList(user);
                    $scope.removeFromList(user);

                } else {
                    $scope.setDeletedState(user);
                    $scope.addMangedUserToList(user);

                }
            } else {
                notify(
                    notifyType.danger,
                    constants.cantDeleteAdmin,
                    icons.warning);
            }

        };

        $scope.openEditDialog = function(size, user) {
            dialogSevice.openEditDialog(size, user, $scope);
        };

        $scope.openAddDialog = function (size) {
            dialogSevice.openAddDialog(size, $scope);
        };

        $scope.addMangedUserToList = function (user) {
            manageListOfUsers.addToList($scope, user);
        };

        $scope.removeFromList = function (user) {
            manageListOfUsers.removeFromList($scope, user);
        }

        $scope.getUserForEditing = function (user) {
            $scope.userForEditing = user;
        };

        $scope.fetchUsers = function () {
            serverService.readAllUsers($scope);
        };

        $scope.controlUserColor = userStateControll($scope);

        $scope.saveAllChanges = function () {
            if ($scope.managedUserslist.length > 0) {

                serverService.manageUser($scope, $scope.managedUserslist);
                notify(
                     notifyType.success,
                     $scope.managedUserslist.length + constants.successfulChanges,
                     icons.success);

            } else {
                notify(
                     notifyType.danger,
                     constants.noPendingChanges,
                     icons.warning);
            }

        };

      
    }
]);
app.service("diagnosticsService",
    [
        '$http', '$q',
        function ($http, $q) {
    return {
        getLastDiagnostics: function() {
            var deferred = $q.defer();
            $http.get("/api/diagnostics")
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    deferred.reject(error);
            });
            return deferred.promise;
        },
        getFromDate: function (fromDate) {
            var deferred = $q.defer();
            if (fromDate) {
                fromDate = "?fromDate=" + fromDate;

                $http.get("/api/diagnostics" + fromDate)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
            }
            return deferred.promise;
        }
    }
}]);
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
app.factory('manageUserSate', [
    'entityState', function (entityState) {
        return {
            setAddedState: function (user) {
                user.EntityState = entityState.Added;
            },

            setDeletedState: function (user) {
                user.EntityState = entityState.Modified;
                user.Disabled = true;
            },

            setModifiedState: function (user) {
                user.EntityState = entityState.Modified;
            }
        }
    }
]);
app.factory('manageListOfUsers', [
    function () {
       return {
           addToList: function ($scope, user) {
               $scope.managedUserslist.push(user);
           },
           removeFromList: function ($scope, user) {
               $scope.users.splice($scope.users.indexOf(user), 1);
           }
        };
    }
]);

app.config(
[
    '$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/Admin/Users',
            {
                templateUrl: '/Admin/Users',
                controller: 'usersController'
            })
            .when('/Admin/Diagnostics',
            {
                templateUrl: '/Admin/Diagnostics',
                controller: 'diagnosticsController'
            })
            .when("/Admin/UserActivity",
            {
                templateUrl: "/Admin/UserActivity",
                controller: "userActivityController"
            });

        $locationProvider.html5Mode(false).hashPrefix('!');

    }
]);
app.factory('serverService',
    [
    'userRepository', function (userRepository) {
        return {
            readAllUsers: function($scope) {
                userRepository
                    .get()
                    .then(function(users) {
                        $scope.users = users;
                    });
            },
            getUserByLogin: function ($scope, login) {
                userRepository
                    .getByLogin(login)
                    .then(function(result) {
                        $scope.result = result;
                    });
            },
            manageUser: function($scope, usersList) {
                userRepository.post(usersList)
                    .then(function(users) {
                        $scope.users = users;
                        $scope.managedUserslist.length = 0;
                    });
            }
        };
    }
]);
app.service("userStateControll", ["entityState",
    function (entityState) {
        return function ($scope) {
            return function (user) {
                if (user.Disabled === true) {
                    return 'danger';
                }
                if (user.EntityState === entityState.Modified) {
                    return 'warning';
                }
                if (user.EntityState === entityState.Added) {
                    return 'success';
                }
                return null;
            };
        };
    }
]);
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
app.controller('loginController', [
    '$scope', '$window', 'broadcastHub', '$location', function ($scope, $window, broadcastHub, $location) {
        $scope.refresh = function () {
            broadcastHub.server.logOff();
            $window.location.href = '/Login/Logout';
        };
    }
]);
app.controller('user-controller', ["$scope",
	"loginService",
	"$window",
	"md5",
	function ($scope, loginService, $window, md5) {
    $scope.IsLogedIn = false;
    $scope.Submitted = false;
    $scope.IsFormValid = false;
    $scope.Pass = '';
    $scope.LoginData = {
        Login: '',
        Password: ''
    };

    $scope.$watch('loginform.$valid', function(newVal) {
        $scope.IsFormValid = newVal;
    });

    $scope.sendLoginToServer = function() {
        $scope.ModelError = '';
        $scope.Submitted = true;
        if ($scope.IsFormValid) {
            $scope.LoginData.Password = md5.createHash($scope.Pass || '');
            loginService.getUser($scope.LoginData).then(function(user) {
                if (user.data.Login != null) {
                    $scope.IsLogedIn = true;
                    $window.location.href = user.data.Role.Name;
                } else {
                    $scope.ModelError = 'Login / Password is incorrect';
                }
            });
        }
    };
}]);
   
app.directive("autoSize", [
    "$timeout",
    "entityState",
    function ($timeout, entityState) {
        var minHeight = 77;
        var maxHeight = 300;
        var height = 0;

        var makeYellow= function(element) {
            element.css("background", "#fcf8e3");
            element.css("color", "#8a6d3b");
        }

        var makeGreen = function (element) {
            element.css("background", "#dff0d8");
            element.css("color", "#3c763d");
        }

        var restrictElementSize = function(element) {
            element.css("overflow", "auto");
            element.css("height", maxHeight + "px");
        }

        var resize = function(scope, element, prevLength) {
            if (scope.section.Text.length < prevLength) {
                element.css("height", "auto");
            }
            height = element[0].scrollHeight;
            if (height > minHeight) {
                element.css("height", height + "px");
                element.css("overflow", "hidden");
            }
        }

        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.css("resize", "none");

                var prevLength = scope.section.Text.length;

                var update = function () {
                    if (scope.section.EntityState === entityState.Modified) {
                        makeYellow(element);
                    }
                    if (scope.section.EntityState === entityState.Added) {
                        makeGreen(element);
                    }
                    if (element[0].scrollHeight < maxHeight) {
                        resize(scope, element, prevLength);
                        prevLength = scope.section.Text.length;
                    } else {
                        restrictElementSize(element);
                    }
                }

                scope.$watch(
                    attr.ngModel,
                    function () {
                        update();
                    });

                attr.$set("ngTrim", "false");
                $timeout(update, 0);
            }
        }
    }]);
app.directive("fileModel", [
	"$parse",
	function($parse) {
		return {
			restrict: "A",
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;

				element.bind("change", function() {
					scope.$apply(function() {
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}
]);
app.directive("modalModel",
	function() {
		return {
			restrict: "A",
			link: function (scope, element, attrs) {
				scope.$watch(attrs.visible,
					function(newValue) {
						if (newValue == true) {
							$(element).modal("show");
						} else {
							$(element).modal("hide");
						}
					});

				$(element).on('shown.bs.modal', function () {
					scope.$apply(function () {
						scope[attrs.visible] = true;
					});
				});

				$(element).on('hidden.bs.modal', function () {
					scope.$apply(function () {
						scope[attrs.visible] = false;
					});
				});
			}
		};
	}
);
app.factory("entityState", function () {
    return Object.freeze({
        Unchanged : 2,
        Added     : 4,
        Deleted   : 8,
        Modified  : 16
    });
});

app.factory("listGroupItem", function () {
    return Object.freeze({
        danger  : "list-group-item-danger",
        heading : "list-group-item-heading",
        info    : "list-group-item-info",
        success : "list-group-item-success",
        text    : "list-group-item-text",
        warning : "list-group-item-warning",
        none    : ""
    });
});

app.factory("prompterResolution", function () {
    return Object.freeze({
        Small: 0,
        Medium: 1,
        Large: 2
    });
});

app.factory("prompterStatus", function () {
    return Object.freeze({
        On    : "On",
        Busy  : "Busy",
        Off   : "Off",

        order : Object.freeze({
            "On"   : 1,
            "Busy" : 2,
            "Off"  : 3
        })
    });
});

app.factory('role', [
    function() {
        return Object.freeze(
        {
            Admin: Object.freeze({
                RoleId: 1,
                Name: 'Admin'
            }),
            Operator: Object.freeze({
                RoleId: 2,
                Name: 'Operator'
            }),
            Prompter: Object.freeze({
                RoleId: 3,
                Name: 'Prompter'
            })

        });

    }
]);
app.factory("textSizes", function () {
    return Object.freeze({
        '15': 15,
        '20': 20,
        '25': 25,
        '30': 30,
        '35': 35,
        '40': 40
    });
});
app.service("notify",
    function () {
        return function(type, message, icon) {
            $.notify({
                message: message,
                icon: icon
            }, {
                type: type,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                template:
                    "<div data-notify=\"container\" class=\"col-xs-11 col-sm-3 alert alert-{0}\" role=\"alert\">" +
                        "<button type=\"button\" aria-hidden=\"true\" class=\"close\" data-notify=\"dismiss\">×</button>" +
                        "<span data-notify=\"icon\"></span> " +
                        "<span data-notify=\"message\">{2}</span>" +
                    "</div>"
            });
        };
    });
app.factory("notifyType", function () {
    return Object.freeze({
        success : "success",
        info    : "info",
        warning : "warning",
        danger  : "danger"
    });
});

app.factory("broadcastHub", function () {
	$.connection.hub.start();
	var hub = $.connection.broadcastHub;
    return hub;
});
app.service("dateFormater", [
    function () {
        var self = this;

        self.formateDate = function (date) {
            //only for string date like:
            //2015-03-20T01:35:18.167 
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);
            var hour = date.substr(11, 2);
            var minute = date.substr(14, 2);
            var second = date.substr(17, 2);

            var formattedDate = day + "/" + month + "/" + year 
                + " - "
                + hour + ":" + minute + ":" + second;

            return formattedDate;
        };

        return self;
    }
]);
app.service("fileUpload", [
	"$http",
	function($http) {
		return function(file, url, succes, error) {
			var formData = new FormData();
			formData.append("file", file);
			$http.post(url,
					formData,
					{
						transformRequest: angular.identity,
						headers: { "Content-Type": undefined }
					})
				.success(function (data) {
					if (succes) {
						succes(data);
					}
				})
				.error(function (message) {
					if (error) {
						error(message);
					}
				});
		};
	}
]);
app.factory('loginService', [
	"$http",

	function ($http) {
    var verifiedUser = {};
    verifiedUser.getUser = function (user) {
        return $http({
            url: '/Login/UserLogin',
            method: 'POST',
            data: JSON.stringify(user),
            headers: { 'content-type': 'application/json' }
        });
    };
    return verifiedUser;
}]);

app.factory("userRepository", [
	"$http",
	"$q",

	function ($http, $q) {
    return {
        get: function() {
            var deferred = $q.defer();
            $http.get("/api/user/")
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    alert(error);
                });
            return deferred.promise;
        },
        getByLogin: function (login) {
            var object = {login: login}
            var deferred = $q.defer();
            $http.get("/api/user/" + login)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    alert(error);
                });
            return deferred.promise;
        },
        post: function(users) {
            var deferred = $q.defer();
            $http.post("/api/user/", users)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    alert(error);
                });
            return deferred.promise;
        }
    }
}]);

app.controller("customizePromptersDialog", [
	"$scope",
	"$modalInstance",
    "broadcastOperator",
	"selectedPrompters",

	function ($scope, $modalInstance, broadcastOperator, selectedPrompters) {

		$scope.items = selectedPrompters;

	    $scope.ok = function () {
	      //  $scope.broadcastOperator.configurePrompters();
	    	$modalInstance.close($scope.items);
	    };

	    $scope.checkAllX = function () {
	        if ($scope.selectedAllX) {
	            $scope.selectedAllX = true;
	        } else {
	            $scope.selectedAllX = false;
	        }
	        angular.forEach($scope.items, function (item) {
	            item.IsMirroredX = $scope.selectedAllX;
	        });
	    };
	    $scope.checkAllY = function () {
	        if ($scope.selectedAllY) {
	            $scope.selectedAllY = true;
	        } else {
	            $scope.selectedAllY = false;
	        }
	        angular.forEach($scope.items, function (item) {
	            item.IsMirroredY = $scope.selectedAllY;
	        });
	    };
	    $scope.options = [
        { label: '600x800', value: 0 },
        { label: '800x1200', value: 1 },
        { label: '1200x1600', value: 2 }
	    ];
	    angular.forEach($scope.items, function (item) {
	        item.Resolution = $scope.options[0];
	    });
	    $scope.selectedAllResolution=$scope.options[0];
	    $scope.checkAllResolution = function () {
	        angular.forEach($scope.items, function (item) {
	            item.Resolution = $scope.selectedAllResolution;
	        });
	    };

	}]);
app.controller("playerController", [
    "$scope",
    "broadcastHub",
    "broadcastOperator",
    "$modal",

    function ($scope, broadcastHub, broadcastOperator, $modal) {
    
    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'customizePrompter.html',
            controller: 'customizePromptersDialog',
            size: size,
            resolve: {
                selectedPrompters: function () {
                    return $scope.broadcastOperator.getConnected();
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.broadcastOperator.configurePrompters();
        }, function () {
	        $scope.broadcastOperator.configurePrompters();
        });
    };


    var textBox = $('#area');

    var animation;
    var maxSpeed = 10;
    var minSpeed = 1;
    var velocity = 15;

    $scope.textIsChanged = false;
    $scope.textSizes = [50,55,60,70,80,90,100,110,130];
    $scope.showDialog = false;
    $scope.speed = 1;
    $scope.currentSize = $scope.textSizes[6];
    $scope.textSize = 90;
    $scope.isPlayDisabled = false;
    $scope.isNavigateButtonShown = false;

    $scope.leftPadding = 0;
    $scope.rightPadding = 0;
    $scope.isMirroredX = undefined;
    $scope.isMirroredY = undefined;
    function setDefaultProps() {
        $scope.isMirroredX = undefined;
        $scope.isMirroredY = undefined;
        $scope.speed = 1;
        $scope.leftPadding = 0;
        $scope.rightPadding = 0;
        $scope.textSize = 90;
        $scope.stop();
    }
    $scope.displayText = function () {
        var text = '\n';
        var sections = $scope.$parent.selectedScript.Sections;
        _.each(sections, function (section) {
            text+='[Section:' + section.Order + ']\n' + section.Text + '\n';
        });
        return text;
    }

    $scope.mirrorText = function (isMirroredX,isMirroredY) {
        broadcastHub.server.mirrorText(isMirroredX, isMirroredY);
    }

    $scope.closePlayer = function () {
        setDefaultProps();
    	$scope.broadcastOperator.successEndBroadcast();
    }

    $scope.dontSaveChanges = function () {
        $scope.showDialog = false;
        $scope.textIsChanged = false;
        $scope.broadcastOperator.successEndBroadcast();
    }

    $scope.saveChanges = function () {
        $scope.showDialog = false;
        $scope.textIsChanged = false;
        $scope.broadcastOperator.successEndBroadcast();
    }

    $scope.play = function () {
        $scope.isPlayDisabled = true;
        animation = setInterval(function () {
            if (textBox.scrollTop() <= textBox.get(0).scrollHeight) {
                textBox.scrollTop(textBox.scrollTop() + $scope.speed);
            }
        }, velocity);
        broadcastHub.server.play();
    }

    $scope.handPlayBack = function () {
        $scope.pause();
        animation = setInterval(function () {
            if (textBox.scrollTop() > 0) {
                textBox.scrollTop(textBox.scrollTop() - $scope.speed);
            }
        }, velocity);
        broadcastHub.server.handPlayBack();
    }

    $scope.handPlay = function () {
        $scope.pause();
        animation = setInterval(function () {
            if (textBox.scrollTop() <= textBox.get(0).scrollHeight) {
                textBox.scrollTop(textBox.scrollTop() + $scope.speed);
            }
        }, velocity);

        broadcastHub.server.handPlay();
    }

    $scope.pause = function () {
        $scope.isHandPlayDisabled = false;
        $scope.isPlayDisabled = false;
        clearInterval(animation);
        broadcastHub.server.pause();
    }

    $scope.stop = function () {
        $scope.isPlayDisabled = false;
        $scope.pause();
        textBox.scrollTop(0);
        broadcastHub.server.stop();
    }
    $scope.speedUp = function () {
        if ($scope.speed < maxSpeed) {
            $scope.speed++;
        }
        broadcastHub.server.speedUp();
    }

    $scope.speedDown = function () {
        if ($scope.speed > minSpeed) {
            $scope.speed--;
        }
        broadcastHub.server.speedDown();
    }

    $scope.getNextSection = function() {
        //TODO: Add code
    }

    $scope.getPrevSection = function() {
        //TODO: Add code
    }

    $scope.padRight = function(percentage) {
        broadcastHub.server.padRight(percentage);
    }

    $scope.padLeft = function(percentage) {
        broadcastHub.server.padLeft(percentage);
    }

    $scope.changeTextSize = function (size) {
        broadcastHub.server.changeTextSize(size);
    }
    
}]);

app.controller("promptersController", [
    "$scope", "prompterRepository", "prompterClass", "prompterOrder", "prompterChecked"
    , 'fetchPrompters',
    function ($scope, prompterRepository, prompterClass, prompterOrder, prompterChecked,
        fetchPrompters) {
        $scope.fetchAllPrompters = fetchPrompters.getPrompters($scope, prompterRepository);
        
       

        var hub = $.connection.refreshPrompterHub;
        hub.client.displayStatus = function () {
            $scope.fetchAllPrompters = fetchPrompters.getPrompters($scope, prompterRepository);
        };
        $.connection.hub.start();
       
        $scope.prompterOrder = prompterOrder;
        $scope.prompterClass = prompterClass;
	    $scope.prompterChecked = prompterChecked;

    }
]);
app.controller("scriptController", [
	"$scope",
    "initScriptCtrlProps",
    "initScriptCtrlFunctions",
	"scriptRepository",
    "broadcastHub",

	function ($scope,
        initScriptCtrlProps,
        initScriptCtrlFunctions,
		scriptRepository,
        broadcastHub) {
	    initScriptCtrlProps($scope);
	    initScriptCtrlFunctions($scope);

		scriptRepository.get().then(function(scripts) {
			$scope.scripts = scripts;
			$scope.selectedScript = null;
		});
	}
]);
app.filter("scriptFilter", [
    "entityState", function(entityState) {
        return function(input) {
            return _.filter(input, function(script) {
                return script.EntityState != entityState.Deleted;
            });
        }
    }
]);
app.service("userActivityRepository",[
    "$http",
    "$q",
    "webApi",
    function ($http, $q, webApi) {
        var self = this;

        self.userActivity = {
            get: function (page) {
                var deferred = $q.defer();
                $http.get(webApi.userActivity+"?page="+page)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            post: function (page) {
                var deferred = $q.defer();
                $http.post(webApi.userActivity,
                    { page: page })
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            clearAllHistory: function() {
                var deferred = $q.defer();
                $http.delete(webApi.userActivity)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }

        self.userActivityActivator = {
            get: function () {
                var deferred = $q.defer();
                $http.get(webApi.userActivityActivator)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            post: function (val) {
                var deferred = $q.defer();
                $http.post(webApi.userActivityActivator
                    + "?isUserActivityActivated=" + val)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }

        return self;
    }
])
app.service("userActivityService", [
    "dateFormater",
    "notify",
    "notifyType",
    "icons",
    function (
        dateFormater,
        notify,
        notifyType,
        icons) {

        var self = this;

        self.dateFormatter = dateFormater.formateDate;

        self.getUserActivityStatus = function(activityStatus) {
            if (activityStatus) {
                return "on";
            }
            return "off";
        }

        self.errorNotification = function (message) {
            notify(
                notifyType.danger,
                message,
                icons.warning);
        }

        self.handleNewLogs = function(newLogs) {
            _.each(newLogs, function (log) {
                log.Date = dateFormater.formateDate(log.Date);
            });
            return newLogs;
        }

        return self;
    }
]);
app.service("userActivityCachingService",[

    function() {
        var self = this;

        var cachedLogs = new Array();

        self.clearCache = function() {
            cachedLogs = new Array();
        }

        self.addPageToCache = function (logPage) {
            cachedLogs.push(logPage);
        }

        self.isPageCached = function (pageNumber) {
            var cachedPageNumber = pageNumber - 1;

            return cachedLogs.length > cachedPageNumber;
        }

        self.getPageFromCache = function (pageNumber) {
            var cachedPageNumber = pageNumber - 1;

            return cachedLogs[cachedPageNumber];
        }

        self.refreshCachePage = function (currentPageLogs, pageNumber) {
            var cachedPageNumber = pageNumber - 1;

            cachedLogs[cachedPageNumber] = currentPageLogs;
        }
        
        return self;
    }
]);
app.service("initScriptCtrlFunctions",
[
    "scriptService",
    "scriptClass",
    "scriptOrder",
    "canPlay",
    "operatorDialog",
    "manageSections",
    "sectionServices",
    "broadcastOperator",
    function(
        scriptService,
        scriptClass,
        scriptOrder,
        canPlay,
        operatorDialog,
        manageSections,
        sectionServices,
        broadcastOperator
        ) {
        return function ($scope) {
            $scope.scriptService = scriptService($scope);
            $scope.scriptClass = scriptClass($scope);
            $scope.canPlay = canPlay($scope);
            $scope.scriptOrder = scriptOrder;
            $scope.operatorDialog = operatorDialog($scope);
            $scope.broadcastOperator = broadcastOperator($scope);

            $scope.dragSectionTemplate = [];
            manageSections.initNewSection($scope.dragSectionTemplate);
            $scope.displaySectionIntro = sectionServices.displaySectionIntro;
            $scope.updateSectionState = manageSections.updateSectionState;
            $scope.isDeleted = manageSections.isDeleted;
            $scope.deleteSection = manageSections.deleteSection;
            $scope.moveSection = manageSections.moveSection;
            $scope.dragNewSection = manageSections.dragNewSection;
            $scope.addNewSection = manageSections.addNewSection;
        }
    }
]);
app.service("initScriptCtrlProps",
[
    "constants",
    "entityState",
    function (constants, entityState) {
    	return function ($scope) {

		    $scope.checked = [];

            $scope.$watch(
                function() { return !$scope.scripts; },
                function(newValue) { $scope.showLoader = newValue; }
            );

            $scope.$watch(
                function() { return !($scope.showLoader || $scope.showPlayer) },
                function(newValue) { $scope.showWorkspace = newValue; }
            );

            $scope.$watch(
                function() { return Boolean($scope.selectedScript) },
                function(newValue) { $scope.showEditor = newValue; }
            );

            $scope.showScriptList = true;
            $scope.scriptListClick = function() {
                $scope.showScriptList = !$scope.showScriptList;
            }

            $scope.showPrompterList = true;
            $scope.prompterListClick = function() {
                $scope.showPrompterList = !$scope.showPrompterList;
            }

            $scope.newScriptName = constants.scriptDefaultName;


            $scope.$watch(
                function() {
                    if (!$scope.scripts) {
                        return false;
                    }
                    return _.some($scope.scripts, function (script) {
                        return script.EntityState !== entityState.Unchanged;
                    });
                },
                function (newValue) { $scope.canSave = newValue; }
            );

            $scope.$watch(
                function () {
                    return $("#my-script-area").width();
                },
                function (newValue) {
                    if (newValue) {
                        $("#my-head-bar").width(newValue);
                    }
                }
            );


        }
    }
]);
app.service("operatorDialog",
    function() {
        return function($scope) {
            var obj = {};

            obj.script = function() {
                $scope.showScriptModal = true;
            };

            obj.import = function() {
                $scope.showImport = true;
            };

            return obj;
        };
    });
app.factory("fetchPrompters", [
	"prompterStatus",
    function (prompterStatus) {
        return {
            getPrompters: function ($scope, prompterRepository) {
                prompterRepository.get().then(
                    function(prompters) {
                    	$scope.prompters = prompters;

                    	var checked = $scope.$parent.checked;
	                    if (checked) {
	                    	var newChecked = [];

		                    _.each(checked, function(checkedItem) {
		                    	var found = _.find(prompters, function (item) {
				                    return item.UserId === checkedItem.UserId
					                    && item.PrompterStatus === prompterStatus.On;
		                    	});
			                    if (found) {
			                    	found.checked = true;
				                    newChecked.push(found);
			                    }
		                    });

		                    $scope.$parent.checked = newChecked;
		                    $scope.checked = newChecked;
	                    }
                    });
            }
        }
    }
]);
app.service("prompterChecked", [
    function () {
    	return function (prompter) {
    		return prompter.checked;
    	}
    }
]);
app.service("prompterClass", [
    "prompterStatus", "listGroupItem",
    function (prompterStatus, listGroupItem) {
        return function (prompter) {
            if (prompter.PrompterStatus === prompterStatus.On) {
                return listGroupItem.success;
            }
            if (prompter.PrompterStatus === prompterStatus.Busy) {
                return listGroupItem.warning;
            }
            return listGroupItem.none;
        };
    }
]);
app.service("prompterOrder", [
    "prompterStatus", 
    function (prompterStatus) {
        return function (prompter) {
            return prompterStatus.order[prompter.PrompterStatus];
        };
    }
]);
app.factory("prompterRepository", [
    "$http", "$q", "webApi",
    function($http, $q, webApi) {
        var obj = {};

        obj.get = function() {
            var deferred = $q.defer();
            $http.get(webApi.prompter)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        return obj;
    }
]);

app.service("broadcastOperator",
[
    "broadcastHub",
	"constants",
    "notify",
    "notifyType",
    "icons",
	"prompterStatus",
    function (broadcastHub, constants, notify, notifyType, icons, prompterStatus) {

        return function ($scope) {

            var obj = {};

            var connectingProgress;
            var prompters;
            var connected;
            var info;
            $scope.index;

            obj.configurePrompters = function() {
            	var prompterInfos = [];
            	_.each(connected, function (item) {
		            prompterInfos.push({
		            	PrompterId: item.UserId,
		            	IsMirroredX: item.IsMirroredX | false,
		            	IsMirroredY: item.IsMirroredY | false,
						Resolution: 0
		            });
            	});
	            broadcastHub.server.configurePrompters(prompterInfos);
            }

            obj.getConnected = function() {
                return connected;
            };

            obj.startBroadcast = function () {
                $scope.showWorkspace = false;
                $scope.connecting = true;

                $scope.sortedScripts = _.sortBy($scope.scripts, 'Title');
                $scope.index = _.indexOf($scope.sortedScripts, $scope.selectedScript);


                connectingProgress = 0;
                prompters = $scope.checked;
                connected = [];
                if (prompters.length) {
                	info = {
                	    //ScriptId: $scope.selectedScript.ScriptId,
                	    ScriptId: $scope.sortedScripts[$scope.index].ScriptId,
            
                	    PrompterIdList: []
                	};
                	_.each(prompters, function (item) {
                		if (item.PrompterStatus === prompterStatus.On) {
                			info.PrompterIdList.push(item.UserId);
		                }
                	});

                	broadcastHub.server.startBroadcast(info);

                	setTimeout(function () {
                		if ($scope.connecting) {
                			broadcastHub.client.cantStartBroadcast();
                		}
                	},
					constants.broadcastTimeout);
                }
            };

            obj.errorEndBroadcast = function () {
            	if (info) {
            		broadcastHub.server.errorEndBroadcast();
		            info = null;
            	}

            	$scope.connecting = false;
	            $scope.showPlayer = false;
	            $scope.showWorkspace = true;
               
            }

            obj.successEndBroadcast = function () {
            	if (info) {
            		broadcastHub.server.successEndBroadcast();
            		info = null;
            	}

            	$scope.connecting = false;
            	$scope.showPlayer = false;
            	$scope.showWorkspace = true;

            }
            
            broadcastHub.client.cantStartBroadcast = function () {
            	obj.errorEndBroadcast();
            	notify(
					notifyType.danger,
					constants.cantConnect,
					icons.warning);
	            $scope.$apply();
            }

            broadcastHub.client.prompterConnected = function (prompterId) {
                var alreadyConnected = _.some(connected, function (item) {
                	return item.UserId === prompterId;
                });
                if (alreadyConnected) {
                    return;
                }

                var found = _.find(prompters, function(item) {
                	return item.UserId === prompterId;
                });
                if (!found) {
                    return;
                }
                found.Resolution = 0;
                found.isMirroredX = false;
                found.isMirroredY = false;
                connected.push(found);

                connectingProgress = 100 * connected.length / prompters.length;
                $(".progress-bar")
					.css("width", connectingProgress + "%")
					.attr("aria-valuenow", connectingProgress);
				
                if (connected.length === prompters.length) {
	                broadcastHub.server.operatorConnected();
                	$scope.connecting = false;
                	$scope.showPlayer = true;
                	notify(
						notifyType.success,
						constants.connectSucces,
						icons.ok);
                }

                $scope.$apply();
            }

            broadcastHub.client.prompterDisconnected = function (prompterId) {
            	var found = _.find(connected, function (item) {
            		return item.UserId === prompterId;
            	});

            	if (!found) {
            		return;
            	}

            	notify( notifyType.danger,
						constants.lostConnectionWith + found.Login,
						icons.warning );

            	connected = _.without(connected, found);

            	if (connected.length === 0) {
            		notify(notifyType.danger,
							constants.allDisconnected,
							icons.warning);

            		$scope.connecting = false;
            		$scope.showPlayer = false;
            		$scope.showWorkspace = true;
	            }

            	$scope.$apply();
            }

            return obj;
        };
    }
]);
app.service("canPlay", [
    "prompterStatus", 
    function (prompterStatus) {
        return function($scope) {
            return function(prompter) {
                return $scope.selectedScript
                    && prompter.PrompterStatus === prompterStatus.On;
            };
        };
    }
]);
app.service("scriptClass", ["entityState", "listGroupItem",
    function (entityState, listGroupItem) {
        return function ($scope) {
            return function(script) {
                if (script === $scope.selectedScript) {
                    return listGroupItem.info;
                }
                if (script.EntityState === entityState.Modified) {
                    return listGroupItem.warning;
                }
                if (script.EntityState === entityState.Added) {
                    return listGroupItem.success;
                }
                return listGroupItem.empty;
            };
        };
    }
]);
app.service("scriptOrder",
    function() {
        return function(script) {
            return script.Title;
        };
    });
app.factory("scriptRepository", [
    "$http", "$q", "webApi",
    function($http, $q, webApi) {
        var obj = {};

        obj.get = function() {
            var deferred = $q.defer();
            $http.get(webApi.script)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        obj.post = function(scripts) {
            var deferred = $q.defer();
            $http.post(webApi.script, scripts)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        return obj;
    }
]);

app.service("scriptService",
[
	"fileUpload",
	"webApi",
	"scriptRepository",
	"entityState",
	"constants",
	"notify",
	"notifyType",
	"icons",
	"prompterStatus",
	function(
		fileUpload,
		webApi,
		scriptRepository,
		entityState,
		constants,
		notify,
		notifyType,
		icons,
		prompterStatus) {

		return function($scope) {
			var obj = {};

			// private members:

			var getFileExtension = function(fileName) {
				if (!_.isString(fileName)) {
					return null;
				}

				var splitByDot = s.words(fileName, ".");
				var length = splitByDot.length;

				if (length === 0) {
					return null;
				}

				return splitByDot[length - 1];
			}

			var failedToImport = function () {
				$scope.showImportLoader = false;
				notify(
					notifyType.danger,
					constants.unimported,
					icons.warning);
			}

			var imported = function (script) {
				$scope.scripts.push(script);
				$scope.showImportLoader = false;
				notify(
					notifyType.success,
					constants.imported + script.Title,
					icons.ok);
			}

			var importPptxFile = function (file) {
				fileUpload(file,
					webApi.presentation,
					imported,
					failedToImport
				);
			}

			var createScript = function(title, description) {
				return {
					Title: title,
					Description: description,
					Sections: [],
					Options: {
						FontSize: constants.defaultFontSize,
						ReadingSpeed: constants.defaultReadingSpeed,
						AnnouncerName: constants.defaultAnnouncer,
						EntityState: entityState.Added
					},
					EntityState: entityState.Added
				};
			}

			var createSection = function(order, text) {
				return {
					Order: order,
					Text: text,
					EntityState: entityState.Added
				};
			}

			var createRegExp = function(str) {
				return new RegExp("(|[a-zA-Z0-9])" + str + "(?=$|[^a-zA-Z0-9])");
			}

			var importTxtFile = function (file) {
				var reader = new FileReader();

				reader.onload = function () {
					var allText = s.trim(reader.result);
					if (!allText) {
						failedToImport();
						return;
					}

					var allParts = allText.split(createRegExp(constants.tagSection));
					if (allParts.length === 0) {
						failedToImport();
						return;
					}

					var header = s.trim(allParts[0]);
					if (!header) {
						failedToImport();
						return;
					}

					var title;
					var description = constants.emptyString;
					if (s.include(header, constants.tagDescription)) {
						var headerParts = header.split(createRegExp(constants.tagDescription));
						title = s.trim(headerParts[0]);
						description = s.trim(headerParts[1]);
					} else {
						title = header;
					}

					if (!s.startsWith(title, constants.tagScript)) {
						failedToImport();
						return;
					}

					title = title.substring(constants.tagScript.length);

					var script = createScript(title, description);

					var order = 0;
					for (var i = 1; i < allParts.length; i++) {
						var sectionText = s.trim(allParts[i]);
						if (sectionText) {
							var section = createSection(order, sectionText);
							script.Sections.push(section);
							++order;
						}
					}

					imported(script);
				}

				reader.readAsText(file);
			}

			var invalidFileExtension = function () {
				$scope.showImportLoader = false;
				notify(
					notifyType.danger,
					constants.invalidFormat,
					icons.warning);
			}

			// public members:

			obj.add = function(form) {
				if (form.$valid) {
					$scope.selectedScript = createScript($scope.newScriptName,
						$scope.newScriptDescription);

					$scope.scripts.push($scope.selectedScript);

					$scope.newScriptName = constants.scriptDefaultName;
					$scope.newScriptDescription = constants.emptyString;

					$scope.showScriptModal = false;
				}
			};

			obj.remove = function(script) {
				if (script === $scope.selectedScript) {
					$scope.selectedScript = null;
				}
				if (script.EntityState === entityState.Added) {
					$scope.scripts = _.without($scope.scripts, script);
				} else {
					script.EntityState = entityState.Deleted;
					if (script.Sections) {
						_.each(script.Sections,
							function(section) {
								section.EntityState = entityState.Deleted;
							});
					}
					if (script.Options) {
						script.Options.EntityState = entityState.Deleted;
					}
				}
			};

			obj.select = function(script) {
				$scope.selectedScript = script;
			};

			obj.save = function() {

				var changed = _.filter($scope.scripts, function(script) {
					return script.EntityState !== entityState.Unchanged;
				});

				var orderSections = function(scripts) {
					_.each(scripts, function(script) {
						_.each(script.Sections, function(section, i) {
							section.Order = i;
						});
					});
				}(changed);

				var oldScripts = $scope.scripts;
				$scope.scripts = undefined;

				scriptRepository.post(changed)
					.then(function(newScripts) {
							$scope.scripts = newScripts;
							$scope.selectedScript = null;
							notify(
								notifyType.success,
								constants.changesSaved,
								icons.ok);
						},
						function() {
							notify(
								notifyType.danger,
								constants.cnagesUnsaved,
								icons.warning);

							$scope.scripts = oldScripts;
						}
					);
			};

			obj.import = function () {
				$scope.showImport = false;
				$scope.showImportLoader = true;

				var file = $scope.scriptFile;
				var extension = getFileExtension(file.name);

				if (extension === "pptx") {
					importPptxFile(file);
				} else if (extension === "txt") {
					importTxtFile(file);
				} else {
					invalidFileExtension();
				}
			};

			obj.initScript = function(script) {
				$scope.index = _.indexOf(_.sortBy($scope.scripts, 'Title'), script);

			}

			obj.saveToTxt = function() {
				var fileName = $scope.selectedScript.Title + ".txt";

				var content = constants.tagScript + "\n"
					+ $scope.selectedScript.Title;

				if ($scope.selectedScript.Description) {
					content += "\n" + constants.tagDescription + "\n"
						+ $scope.selectedScript.Description;
				}

				_.each($scope.selectedScript.Sections,
					function(section) {
						content += "\n\n\n"
							+ constants.tagSection + "\n"
							+ section.Text;
					});

				saveTextAs(content, fileName);
			};

			// prompter list function
			obj.check = function(prompter) {
				if (prompter.checked) {
					prompter.checked = false;
					$scope.checked = _.without($scope.checked, prompter);
				} else if (prompter.PrompterStatus === prompterStatus.On) {
					prompter.checked = true;
					$scope.checked.push(prompter);
				}
			}

			// prompter list function
			obj.canCheck = function(prompter) {
				return prompter.PrompterStatus === prompterStatus.On;
			}

			return obj;
		};
	}
]);
app.service("manageSections", [
    "entityState",
    function (entityState) {
        var self = this;

        var changeScriptState = function (script) {
            if (script.EntityState !== entityState.Added) {
                script.EntityState = entityState.Modified;
            }
        }

        var createNewSection = function (index, scriptId) {
            return {
                Order: index,
                Text: "",
                ScriptId: scriptId || 0,
                EntityState: entityState.Added
            };
        }

        self.initNewSection = function (section) {
            section.length = 0;
            section.push(createNewSection(0));
        }
        
        self.deleteSection = function (section, script) {
            if (section.EntityState !== entityState.Added) {
                section.EntityState = entityState.Deleted;
            } else {
                var index = script.Sections.indexOf(section);
                script.Sections.splice(index, 1);
            }
            changeScriptState(script);
        }

        self.isDeleted = function (section) {
            if (section.EntityState !== entityState.Deleted)
                return true;
            return false;
        }

        self.updateSectionState = function (section, script) {
            if (script !== null
                && script !== undefined) {
                if (section.EntityState !== entityState.Modified &&
                    section.EntityState !== entityState.Added) {
                    section.EntityState = entityState.Modified;
                }
                changeScriptState(script);
            }
        }

        self.moveSection = function (section, script) {

            script.Sections.splice(script.Sections.indexOf(section), 1);
            changeScriptState(script);
            _.each(script.Sections, function (section) {
                if (section.EntityState !== entityState.Added
                    && section.EntityState !== entityState.Deleted) {
                    section.EntityState = entityState.Modified;
                }
            });

        }

        self.dragNewSection = function (section, script) {
            _.each(script.Sections, function (section) {
                section.ScriptId = script.ScriptId;
                section.isFocused = true;
                if (section.EntityState !== entityState.Deleted
                     && section.EntityState !== entityState.Added) {
                    section.EntityState = entityState.Modified;
                }

            });
            changeScriptState(script);
        }

        self.addNewSection = function (script) {
            var newSection = createNewSection(script.length - 1, script.ScriptId);
            script.Sections.push(newSection);
            changeScriptState(script);
            newSection.isFocused = true;


        }

        return self;
    }
]);
app.service("sectionServices", [
    "constants",
    function (constants) {
        var self = this;

        self.displaySectionIntro = function(section) {
            var intro = section.Text;
            var introLength = constants.sectionsIntroLength;
            if (section.Text.length > introLength) {
                intro = section.Text.substring(0, introLength) + "...";
            }
            return intro;
        }

        return self;
    }
]);