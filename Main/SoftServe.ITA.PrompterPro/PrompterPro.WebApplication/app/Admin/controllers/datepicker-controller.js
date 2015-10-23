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