app.filter("scriptFilter", [
    "entityState", function(entityState) {
        return function(input) {
            return _.filter(input, function(script) {
                return script.EntityState != entityState.Deleted;
            });
        }
    }
]);