app.controller("customizePromptersDialog", [
	"$scope",
	"$modalInstance",
    "broadcastOperator",
	"selectedPrompters",

	function ($scope, $modalInstance, broadcastOperator, selectedPrompters) {

		$scope.items = selectedPrompters;

	    $scope.ok = function () {
	      //  $scope.broadcastOperator.configurePrompters();
	    	$modalInstance.close($scope.items);
	    };

	    $scope.checkAllX = function () {
	        if ($scope.selectedAllX) {
	            $scope.selectedAllX = true;
	        } else {
	            $scope.selectedAllX = false;
	        }
	        angular.forEach($scope.items, function (item) {
	            item.IsMirroredX = $scope.selectedAllX;
	        });
	    };
	    $scope.checkAllY = function () {
	        if ($scope.selectedAllY) {
	            $scope.selectedAllY = true;
	        } else {
	            $scope.selectedAllY = false;
	        }
	        angular.forEach($scope.items, function (item) {
	            item.IsMirroredY = $scope.selectedAllY;
	        });
	    };
	    $scope.options = [
        { label: '600x800', value: 0 },
        { label: '800x1200', value: 1 },
        { label: '1200x1600', value: 2 }
	    ];
	    angular.forEach($scope.items, function (item) {
	        item.Resolution = $scope.options[0];
	    });
	    $scope.selectedAllResolution=$scope.options[0];
	    $scope.checkAllResolution = function () {
	        angular.forEach($scope.items, function (item) {
	            item.Resolution = $scope.selectedAllResolution;
	        });
	    };

	}]);