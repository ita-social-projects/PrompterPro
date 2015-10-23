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