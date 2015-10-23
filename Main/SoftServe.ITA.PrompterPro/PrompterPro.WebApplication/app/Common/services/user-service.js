app.factory("userRepository", [
	"$http",
	"$q",

	function ($http, $q) {
    return {
        get: function() {
            var deferred = $q.defer();
            $http.get("/api/user/")
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    alert(error);
                });
            return deferred.promise;
        },
        getByLogin: function (login) {
            var object = {login: login}
            var deferred = $q.defer();
            $http.get("/api/user/" + login)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    alert(error);
                });
            return deferred.promise;
        },
        post: function(users) {
            var deferred = $q.defer();
            $http.post("/api/user/", users)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    alert(error);
                });
            return deferred.promise;
        }
    }
}]);
