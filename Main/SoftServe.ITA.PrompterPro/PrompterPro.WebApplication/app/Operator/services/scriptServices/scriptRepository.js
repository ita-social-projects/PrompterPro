app.factory("scriptRepository", [
    "$http", "$q", "webApi",
    function($http, $q, webApi) {
        var obj = {};

        obj.get = function() {
            var deferred = $q.defer();
            $http.get(webApi.script)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        obj.post = function(scripts) {
            var deferred = $q.defer();
            $http.post(webApi.script, scripts)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        return obj;
    }
]);
