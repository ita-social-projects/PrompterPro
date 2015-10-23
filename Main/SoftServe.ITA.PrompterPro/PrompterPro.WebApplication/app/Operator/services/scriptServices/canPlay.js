app.service("canPlay", [
    "prompterStatus", 
    function (prompterStatus) {
        return function($scope) {
            return function(prompter) {
                return $scope.selectedScript
                    && prompter.PrompterStatus === prompterStatus.On;
            };
        };
    }
]);