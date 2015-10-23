app.controller('user-controller', ["$scope",
	"loginService",
	"$window",
	"md5",
	function ($scope, loginService, $window, md5) {
    $scope.IsLogedIn = false;
    $scope.Submitted = false;
    $scope.IsFormValid = false;
    $scope.Pass = '';
    $scope.LoginData = {
        Login: '',
        Password: ''
    };

    $scope.$watch('loginform.$valid', function(newVal) {
        $scope.IsFormValid = newVal;
    });

    $scope.sendLoginToServer = function() {
        $scope.ModelError = '';
        $scope.Submitted = true;
        if ($scope.IsFormValid) {
            $scope.LoginData.Password = md5.createHash($scope.Pass || '');
            loginService.getUser($scope.LoginData).then(function(user) {
                if (user.data.Login != null) {
                    $scope.IsLogedIn = true;
                    $window.location.href = user.data.Role.Name;
                } else {
                    $scope.ModelError = 'Login / Password is incorrect';
                }
            });
        }
    };
}]);
   