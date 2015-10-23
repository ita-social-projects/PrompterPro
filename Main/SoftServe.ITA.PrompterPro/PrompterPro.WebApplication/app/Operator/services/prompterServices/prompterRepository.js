app.factory("prompterRepository", [
    "$http", "$q", "webApi",
    function($http, $q, webApi) {
        var obj = {};

        obj.get = function() {
            var deferred = $q.defer();
            $http.get(webApi.prompter)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        return obj;
    }
]);
