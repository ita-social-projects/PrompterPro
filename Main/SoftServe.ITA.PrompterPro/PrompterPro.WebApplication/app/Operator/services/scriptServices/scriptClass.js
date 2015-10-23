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