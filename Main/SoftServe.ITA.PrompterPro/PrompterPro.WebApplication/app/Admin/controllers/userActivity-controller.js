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