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