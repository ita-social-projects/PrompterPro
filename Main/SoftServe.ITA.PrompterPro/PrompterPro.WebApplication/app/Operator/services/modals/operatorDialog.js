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