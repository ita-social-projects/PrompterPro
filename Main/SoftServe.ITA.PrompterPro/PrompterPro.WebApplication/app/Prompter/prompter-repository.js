app.factory("prompterRepository", [
    "$http",
    function ($http) {
        var obj = {};

        obj.get = function (id, callback) {
            var url = "api/script/" + String(id);

            $http.get(url)
                .success(function(response) {
	            callback(response);
            });
        };

        return obj;
    }
]);
