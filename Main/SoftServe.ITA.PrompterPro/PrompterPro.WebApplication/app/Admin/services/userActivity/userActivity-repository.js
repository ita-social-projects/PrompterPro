app.service("userActivityRepository",[
    "$http",
    "$q",
    "webApi",
    function ($http, $q, webApi) {
        var self = this;

        self.userActivity = {
            get: function (page) {
                var deferred = $q.defer();
                $http.get(webApi.userActivity+"?page="+page)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            post: function (page) {
                var deferred = $q.defer();
                $http.post(webApi.userActivity,
                    { page: page })
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            clearAllHistory: function() {
                var deferred = $q.defer();
                $http.delete(webApi.userActivity)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }

        self.userActivityActivator = {
            get: function () {
                var deferred = $q.defer();
                $http.get(webApi.userActivityActivator)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            post: function (val) {
                var deferred = $q.defer();
                $http.post(webApi.userActivityActivator
                    + "?isUserActivityActivated=" + val)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }

        return self;
    }
])