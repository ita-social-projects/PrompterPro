app.service("initScriptCtrlProps",
[
    "constants",
    "entityState",
    function (constants, entityState) {
    	return function ($scope) {

		    $scope.checked = [];

            $scope.$watch(
                function() { return !$scope.scripts; },
                function(newValue) { $scope.showLoader = newValue; }
            );

            $scope.$watch(
                function() { return !($scope.showLoader || $scope.showPlayer) },
                function(newValue) { $scope.showWorkspace = newValue; }
            );

            $scope.$watch(
                function() { return Boolean($scope.selectedScript) },
                function(newValue) { $scope.showEditor = newValue; }
            );

            $scope.showScriptList = true;
            $scope.scriptListClick = function() {
                $scope.showScriptList = !$scope.showScriptList;
            }

            $scope.showPrompterList = true;
            $scope.prompterListClick = function() {
                $scope.showPrompterList = !$scope.showPrompterList;
            }

            $scope.newScriptName = constants.scriptDefaultName;


            $scope.$watch(
                function() {
                    if (!$scope.scripts) {
                        return false;
                    }
                    return _.some($scope.scripts, function (script) {
                        return script.EntityState !== entityState.Unchanged;
                    });
                },
                function (newValue) { $scope.canSave = newValue; }
            );

            $scope.$watch(
                function () {
                    return $("#my-script-area").width();
                },
                function (newValue) {
                    if (newValue) {
                        $("#my-head-bar").width(newValue);
                    }
                }
            );


        }
    }
]);