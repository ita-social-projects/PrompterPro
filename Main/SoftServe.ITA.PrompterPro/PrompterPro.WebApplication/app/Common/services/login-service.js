app.factory('loginService', [
	"$http",

	function ($http) {
    var verifiedUser = {};
    verifiedUser.getUser = function (user) {
        return $http({
            url: '/Login/UserLogin',
            method: 'POST',
            data: JSON.stringify(user),
            headers: { 'content-type': 'application/json' }
        });
    };
    return verifiedUser;
}]);