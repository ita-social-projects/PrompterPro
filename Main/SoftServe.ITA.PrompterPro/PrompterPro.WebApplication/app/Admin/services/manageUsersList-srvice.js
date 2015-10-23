app.factory('manageListOfUsers', [
    function () {
       return {
           addToList: function ($scope, user) {
               $scope.managedUserslist.push(user);
           },
           removeFromList: function ($scope, user) {
               $scope.users.splice($scope.users.indexOf(user), 1);
           }
        };
    }
]);
