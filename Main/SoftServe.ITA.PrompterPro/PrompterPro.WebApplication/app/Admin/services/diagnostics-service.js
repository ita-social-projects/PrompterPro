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