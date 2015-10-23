app.controller('loginController', [
    '$scope', '$window', 'broadcastHub', '$location', function ($scope, $window, broadcastHub, $location) {
        $scope.refresh = function () {
            broadcastHub.server.logOff();
            $window.location.href = '/Login/Logout';
        };
    }
]);