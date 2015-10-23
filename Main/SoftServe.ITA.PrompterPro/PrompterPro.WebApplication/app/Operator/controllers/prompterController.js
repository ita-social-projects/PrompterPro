app.controller("promptersController", [
    "$scope", "prompterRepository", "prompterClass", "prompterOrder", "prompterChecked"
    , 'fetchPrompters',
    function ($scope, prompterRepository, prompterClass, prompterOrder, prompterChecked,
        fetchPrompters) {
        $scope.fetchAllPrompters = fetchPrompters.getPrompters($scope, prompterRepository);
        
       

        var hub = $.connection.refreshPrompterHub;
        hub.client.displayStatus = function () {
            $scope.fetchAllPrompters = fetchPrompters.getPrompters($scope, prompterRepository);
        };
        $.connection.hub.start();
       
        $scope.prompterOrder = prompterOrder;
        $scope.prompterClass = prompterClass;
	    $scope.prompterChecked = prompterChecked;

    }
]);