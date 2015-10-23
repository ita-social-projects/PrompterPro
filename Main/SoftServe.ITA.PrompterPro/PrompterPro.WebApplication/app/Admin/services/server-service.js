app.factory('serverService',
    [
    'userRepository', function (userRepository) {
        return {
            readAllUsers: function($scope) {
                userRepository
                    .get()
                    .then(function(users) {
                        $scope.users = users;
                    });
            },
            getUserByLogin: function ($scope, login) {
                userRepository
                    .getByLogin(login)
                    .then(function(result) {
                        $scope.result = result;
                    });
            },
            manageUser: function($scope, usersList) {
                userRepository.post(usersList)
                    .then(function(users) {
                        $scope.users = users;
                        $scope.managedUserslist.length = 0;
                    });
            }
        };
    }
]);