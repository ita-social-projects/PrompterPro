app.controller('diagnosticsMessageModalController',
    ['$scope', '$modalInstance', 'diagnostic',
        function ($scope, $modalInstance, diagnostic) {
    $scope.name = diagnostic.ExceptionName;
    $scope.message = diagnostic.Message;
    $scope.close = function () {
        $modalInstance.dismiss('close');
    };
}]);